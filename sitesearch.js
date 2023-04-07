const{autocomplete:t}=window["@algolia/autocomplete-js"],algoliaHighlightTag=t=>t&&t.replace(/<em>/g,"__aa-highlight__").replace(/<\/em>/g,"__/aa-highlight__")||" ",resovleResult=t=>t?.hits?.hits&&t.hits.hits.map(t=>({title:t._source.title,url:t._source.url,_highlightResult:{title:{value:t.highlight?.title&&t.highlight?.title.map(t=>algoliaHighlightTag(t)).join(" ... ")||""},html:{value:t.highlight?.html&&t.highlight?.html.map(t=>algoliaHighlightTag(t)).join(" ... ")||""}}}))||[],endpoint="https://crawler.nasuyun.com";window.addEventListener("DOMContentLoaded",function(){let e=document.getElementById("autocomplete"),i=e.getAttribute("compid"),l=e.getAttribute("token"),a=async(t,e)=>{let i=JSON.stringify({component:t,query:e}),a=await fetch(endpoint+"/api/searchui/_query",{headers:{token:l,"Content-Type":"application/json"},method:"POST",body:i});return await a.json()};fetch(endpoint+"/api/searchui/_config",{headers:{compid:i,token:l}}).then(t=>t.json()).then(e=>{let i=e?.theme?.urlAppenders;t({container:"#autocomplete",placeholder:`${e?.theme?.placeholder||"search"}`,plugins:[],openOnFocus:!0,getSources:()=>[{sourceId:"links",getItems:({query:t})=>t?a(e,t).then(t=>i&&[i,...resovleResult(t)]||resovleResult(t)):i,onSelect({item:t}){window.open(t.url,e?.theme?.open||"_self")},templates:{item:({item:t,components:e,html:i})=>i`
                  <div class="aa-ItemWrapper">
                  <div class="aa-ItemContent">
                       ${t.icon&&i`<img src="${t.icon}" width="30" height="30" />`}
                     <div class="aa-ItemContentBody">
                        <div class="aa-ItemContentTitle">
                        ${t._highlightResult?.title?.value&&e.Highlight({hit:t,attribute:"title"})||t.title}
                        </div>
                        <div class="aa-ItemContentDescription">
                        ${e.Highlight({hit:t,attribute:"html"})}
                        </div>
                     </div>
                  </div>
               </div>
                  `}},]})})});