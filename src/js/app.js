import DOM from './Dom';
import svgCollection from './svgCollection';
import Storage from './Storage';
import DnD from './DnD';

const dom = new DOM('main', svgCollection);
const storage = new Storage(localStorage);
const dnd = new DnD();
dnd.init();

if (localStorage.content) {
  dom.displayData(storage.getData('content'));
  dom.initListener();
} else {
  dom.init();
}

window.addEventListener('unload', () => {
  storage.addData(dom.getData(), 'content');
});
