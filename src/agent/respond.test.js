import { answer, respond, TARGETS } from './respond';
import { INTENTS } from './content';

const allText = () => INTENTS.map((it) => it.r).join(' ');
const noSearch = async () => null;

describe('facts cb0t must get right', () => {
  test('never discloses clearance details', async () => {
    for (const q of ['does he have a clearance', 'is he cleared', 'can he do classified work', 'ts/sci?']) {
      const r = await answer(q, noSearch);
      expect(r.text).toMatch(/ask connor about directly/);
    }
    expect(allText()).not.toMatch(/secret clearance|not active/i);
  });

  test('never calls the trading agent real money', async () => {
    const r = await answer('did the trading agent make money', noSearch);
    expect(r.text).toMatch(/on paper/);
    expect(r.text).toMatch(/no real money/);
    expect(allText()).not.toMatch(/real closed/i);
  });

  test('says when tech is not listed instead of guessing', async () => {
    const r = await answer('does he know rust', noSearch);
    expect(r.text).toMatch(/don’t see <b>Rust<\/b>/);
  });

  test('declines requests to generate things', () => {
    expect(respond('write me a python script').text).toMatch(/can’t write or generate/);
  });
});

describe('routing', () => {
  test('a project name opens that project', () => {
    expect(respond('show me the drone').act).toEqual({ type: 'project', id: 'drone' });
  });

  test('a skill lights up its projects', () => {
    const r = respond('python projects');
    expect(r.act.type).toBe('highlight');
    expect(r.act.ids).toContain('trading-agent');
  });

  test('location questions get the location', () => {
    for (const q of ['where is he based', 'where is connor from', 'what city is he in']) expect(respond(q).text).toBe('Huntsville / Nashville.');
  });

  test('work history questions get the history', () => {
    for (const q of ['what jobs has he had', 'how many years of experience does he have']) expect(respond(q).text).toMatch(/Yard Robotics/);
  });

  test('how the trading agent ended gets the results', () => {
    for (const q of ['why did he stop the trading agent', 'what happened with the trading agent', 'did the trading agent work']) expect(respond(q).text).toMatch(/on paper/);
  });

  test('cv means resume, not computer vision', () => {
    expect(respond('can i see his cv').text).toMatch(/resume/);
  });

  test('admits it when nothing matches and the model is unavailable', async () => {
    const r = await answer('what is the capital of france', noSearch);
    expect(r.text).toMatch(/didn’t catch that/);
  });
});

describe('embedding layer', () => {
  const hits = (...pairs) => async () => pairs;

  test('a confident match wins over a miss', async () => {
    const r = await answer('the flying robot thing', hits(['project:drone', 0.8], ['intent:job', 0.5]));
    expect(r.act).toEqual({ type: 'project', id: 'drone' });
  });

  test('a medium match asks instead of guessing', async () => {
    const r = await answer('the one with the quadcopter', hits(['project:drone', 0.55], ['intent:job', 0.5]));
    expect(r.text).toMatch(/did you mean/);
    expect(r.chips).toHaveLength(2);
  });

  test('a low match stays a miss', async () => {
    const r = await answer('recommend a good movie', hits(['intent:best', 0.3]));
    expect(r.text).toMatch(/didn’t catch that/);
  });

  test('a named skill is not overridden by a different skill', async () => {
    const r = await answer('does he do infrastructure work', hits(['skill:data', 0.7], ['skill:devops', 0.5]));
    expect(r.text).toMatch(/DevOps/);
  });

  test('a named skill stays on that skill when the model picks an unrelated answer', async () => {
    const r = await answer('does he have machine learning experience', hits(['intent:job', 0.7], ['intent:history', 0.5]));
    expect(r.text).toMatch(/AI \/ LLMs/);
  });

  test('a specific project can still beat a skill keyword', async () => {
    const r = await answer('self hosted chatbot with sensitive data', hits(['project:private-ai', 0.72], ['skill:data', 0.4]));
    expect(r.act).toEqual({ type: 'project', id: 'private-ai' });
  });

  test('every target has something to embed', () => {
    TARGETS.forEach((t) => expect(t.anchors.length).toBeGreaterThan(0));
  });
});
