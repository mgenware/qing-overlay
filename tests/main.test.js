import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import { kEvent, aTimeout } from './lib';
import '../dist/main';

it('Core properties', async () => {
  const el = await fixture(html`
    <qing-dialog dialogTitle="Greetings" .buttons=${['ok']}
      ><p>test</p></qing-dialog
    >
  `);

  expect(el.innerHTML).to.eq('<p>test</p>');
  expect(el.getAttribute('dialogTitle')).to.eq('Greetings');
});

it('isOpenChanged, shown', async () => {
  const el = await fixture(html`
    <qing-dialog dialogTitle="Title" .buttons=${['ok']} }}>
      <div>Hello World</div>
      <form>
        <input type="text" value="name" id="textInput" />
      </form>
    </qing-dialog>
  `);

  const isOpen = oneEvent(el, 'isOpenChanged');
  const shown = oneEvent(el, 'shown');
  el.setAttribute('isOpen', '');
  const events = await Promise.all([isOpen, shown]);

  // Both isOpenChanged and shown have the same event args.
  expect(events[0].detail).to.deep.eq({ isOpen: true });
  expect(events[1].detail).to.deep.eq({ isOpen: true });
  expect(el.hasAttribute('isOpen')).to.eq(true);
  expect(el.getAttribute('isOpen')).to.eq('');
});

it('Cannot be dismissed by Esc when no cancel button is present', async () => {
  const el = await fixture(html`
    <qing-dialog dialogTitle="Title" .buttons=${['ok', 'cancel']} }}>
      <div>Hello World</div>
      <form>
        <input type="text" value="name" id="textInput" />
      </form>
    </qing-dialog>
  `);

  const isOpen = oneEvent(el, 'isOpenChanged');
  el.setAttribute('isOpen', '');
  await aTimeout();

  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

  await isOpen;
  expect(el.hasAttribute('isOpen')).to.eq(true);
});

it('Dismissed by Esc, isOpenChanged, closed', async () => {
  const el = await fixture(html`
    <qing-dialog dialogTitle="Title" .buttons=${['ok']} }}>
      <div>Hello World</div>
      <form>
        <input type="text" value="name" id="textInput" />
      </form>
    </qing-dialog>
  `);

  const isOpen = kEvent(el, 'isOpenChanged', 2);
  const closed = oneEvent(el, 'closed');
  el.setAttribute('isOpen', '');
  await aTimeout();

  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

  const isOpenEvents = await isOpen;
  expect(el.hasAttribute('isOpen')).to.eq(false);
  expect(isOpenEvents[0]).to.deep.eq({ isOpen: true });
  expect(isOpenEvents[1]).to.deep.eq({
    isOpen: false,
    isCancelled: true,
  });

  const closedEvent = await closed;
  // Both isOpenChanged and closed have the same event args.
  expect(closedEvent.detail).to.deep.eq({
    isOpen: false,
    isCancelled: true,
  });
});

it('Focus', async () => {
  const el = await fixture(html`
    <qing-dialog dialogTitle="Title" .buttons=${['ok']}>
      <div>Hello World</div>
      <form>
        <input type="text" value="name" id="textInput" />
      </form>
    </qing-dialog>
  `);

  el.addEventListener('isOpenChanged', e => {
    if (e.detail) {
      document.getElementById('textInput').focus();
    }
  });
  el.setAttribute('isOpen', '');
  await aTimeout();

  expect(document.activeElement).to.eq(document.getElementById('textInput'));
});
