import marked from 'marked';
import MarkedTerminalRenderer from 'marked-terminal';

marked.setOptions({
  renderer: new MarkedTerminalRenderer()
});

export default marked;
