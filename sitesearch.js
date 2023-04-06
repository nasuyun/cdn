const{autocomplete:t}=window["@algolia/autocomplete-js"],algoliaHighlightTag=t=>t&&t.replace(/<em>/g,"__aa-highlight__").replace(/<\/em>/g,"__/aa-highlight__")||" ",resovleResult=t=>t?.hits?.hits&&t.hits.hits.map(t=>({title:t._source.title,url:t._source.url,_highlightResult:{title:{value:t.highlight?.title&&t.highlight?.title.map(t=>algoliaHighlightTag(t)).join(" ... ")||""},html:{value:t.highlight?.html&&t.highlight?.html.map(t=>algoliaHighlightTag(t)).join(" ... ")||""}}}))||[];window.addEventListener("DOMContentLoaded",function(){var e;let i=document.getElementById("autocomplete"),l=i.getAttribute("compid"),a=i.getAttribute("token"),h=async(t,e)=>{let i=JSON.stringify({component:t,query:e}),l=await fetch("https://crawler.nasuyun.com/ui/_query",{headers:{token:a,"Content-Type":"application/json"},method:"POST",body:i});return await l.json()};async function o(){let t=await fetch("https://crawler.nasuyun.com/ui/_config",{headers:{compid:l,token:a}});e=await t.json()}o(),t({container:"#autocomplete",placeholder:`${e?.theme.placeholder||"search"}`,plugins:[],openOnFocus:!0,getSources:()=>[{sourceId:"links",getItems:({query:t})=>h(e,t).then(t=>resovleResult(t)),onSelect({item:t}){window.open(t.url,e?.config?.blank?"_blank":"_self")},templates:{item:({item:t,components:e,html:i})=>i`
              <div class="aa-ItemWrapper">
                <div class="aa-ItemContent">
                  <div class="aa-ItemContentBody">
                    <div class="aa-ItemContentTitle">
                    ${t._highlightResult?.title?.value&&e.Highlight({hit:t,attribute:"title"})||t.title}
                    </div>
                    <div class="aa-itemContentDescription">
                      ${e.Highlight({hit:t,attribute:"html"})}
                    </div>
                  </div>
                </div>
              </div>`},noResults:()=>"No result for this query."},]})});