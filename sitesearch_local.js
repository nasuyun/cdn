
const { autocomplete } = window['@algolia/autocomplete-js'];

// 高亮处理
const algoliaHighlightTag = (text) => (
  text && text.replace(/<em>/g, '__aa-highlight__')
    .replace(/<\/em>/g, '__/aa-highlight__') || ' '
)

// es数据扁平化
const resovleResult = (result) => (
  result?.hits?.hits &&
  result.hits.hits.map((item) => ({
    title: item._source.title,
    url: item._source.url,
    _highlightResult: {
      title: {
        value: item.highlight?.title && item.highlight?.title.map((v) => algoliaHighlightTag(v)).join(" ... ") || ''
      },
      html: {
        value: item.highlight?.html && item.highlight?.html.map((v) => algoliaHighlightTag(v)).join(" ... ") || ''
      }
    }
  })) || []
)

window.addEventListener('DOMContentLoaded', function () {

  const elmtAutoComplete = document.getElementById("autocomplete");
  const compid = elmtAutoComplete.getAttribute('compid');
  const token = elmtAutoComplete.getAttribute('token');

  const doQuery = async (component, query) => {
    const data = JSON.stringify({ component, query });
    const response = await fetch('http://localhost:8080/api/searchui/_query',
      {
        headers: { token, "Content-Type": "application/json" },
        method: 'POST',
        body: data
      })
    return await response.json();
  }  

  var component;
  async function readComponent() {
    const response = await fetch('http://localhost:8080/api/searchui/_config', { headers: { compid, token } });
    component = await response.json();
  }
  readComponent();

  autocomplete({
    container: '#autocomplete',
    placeholder: `${component?.theme?.placeholder || 'search'}`,
    plugins: [],
    openOnFocus: true,
    getSources() {
      return [
        {
          sourceId: 'links',
          getItems({ query }) {
            return doQuery(component, query).then(data => resovleResult(data));
          },
          onSelect({ item }) {
            window.open(item.url, component?.config?.blank ? '_blank' : '_self');
          },
          templates: {
            item({ item, components, html }) {
              return html`
              <div class="aa-ItemWrapper">
                <div class="aa-ItemContent">
                  <div class="aa-ItemContentBody">
                    <div class="aa-ItemContentTitle">
                    ${item._highlightResult?.title?.value && components.Highlight({ hit: item, attribute: 'title' }) || item.title}
                    </div>
                    <div class="aa-itemContentDescription">
                      ${components.Highlight({ hit: item, attribute: 'html' })}
                    </div>
                  </div>
                </div>
              </div>`;
            },
          },
          noResults() {
            return "No result for this query.";
          }
        },
      ];
    },
  })

})









