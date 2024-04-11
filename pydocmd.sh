echo -e "---\nlayout: layouts/docs.njk\n---\n<div class=\"toc\">\n" > docs.md
pydoc-markdown -m tunepad -m tunepad.constants -m tunepad.chords -I ./assets/python/ '{
    renderer: {
      type: markdown,
      render_toc: true
    }
  }' | sed -e '/<a id="tunepad">/,$d' >> docs.md
echo -e "</div>\n" >> docs.md
echo -e "<div class=\"docs\">" >> docs.md
pydoc-markdown -m tunepad -m tunepad.constants -m tunepad.chords -I ./assets/python/ '{
    renderer: {
      type: markdown,
      descriptive_class_title: false,
      render_toc: false,
      signature_in_header: true,
      signature_code_block: false,
      classdef_code_block: false
    }
  }' >> docs.md
echo -e "</div>\n" >> docs.md

