const endpoint = "http://pretty.nasuyun.com"

const clearIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
<path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
</svg>`

const emptyPageHtml = `
<div class="hits-empty-state" style="min-width:600px">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="138"
    height="138"
    class="hits-empty-state-image"
  >
    <defs>
      <linearGradient id="c" x1="50%" x2="50%" y1="100%" y2="0%">
        <stop offset="0%" stop-color="#F5F5FA" />
        <stop offset="100%" stop-color="#FFF" />
      </linearGradient>
      <path
        id="b"
        d="M68.71 114.25a45.54 45.54 0 1 1 0-91.08 45.54 45.54 0 0 1 0 91.08z"
      />
      <filter
        id="a"
        width="140.6%"
        height="140.6%"
        x="-20.3%"
        y="-15.9%"
        filterUnits="objectBoundingBox"
      >
        <feOffset dy="4" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
          stdDeviation="5.5"
        />
        <feColorMatrix
          in="shadowBlurOuter1"
          result="shadowMatrixOuter1"
          values="0 0 0 0 0.145098039 0 0 0 0 0.17254902 0 0 0 0 0.380392157 0 0 0 0.15 0"
        />
        <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter2" />
        <feGaussianBlur
          in="shadowOffsetOuter2"
          result="shadowBlurOuter2"
          stdDeviation="1.5"
        />
        <feColorMatrix
          in="shadowBlurOuter2"
          result="shadowMatrixOuter2"
          values="0 0 0 0 0.364705882 0 0 0 0 0.392156863 0 0 0 0 0.580392157 0 0 0 0.2 0"
        />
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1" />
          <feMergeNode in="shadowMatrixOuter2" />
        </feMerge>
      </filter>
    </defs>
    <g fill="none" fill-rule="evenodd">
      <circle
        cx="68.85"
        cy="68.85"
        r="68.85"
        fill="#5468FF"
        opacity=".07"
      />
      <circle
        cx="68.85"
        cy="68.85"
        r="52.95"
        fill="#5468FF"
        opacity=".08"
      />
      <use fill="#000" filter="url(#a)" xlink:href="#b" />
      <use fill="url(#c)" xlink:href="#b" />
      <path
        d="M76.01 75.44c5-5 5.03-13.06.07-18.01a12.73 12.73 0 0 0-18 .07c-5 4.99-5.03 13.05-.07 18a12.73 12.73 0 0 0 18-.06zm2.5 2.5a16.28 16.28 0 0 1-23.02.09A16.29 16.29 0 0 1 55.57 55a16.28 16.28 0 0 1 23.03-.1 16.28 16.28 0 0 1-.08 23.04zm1.08-1.08l-2.15 2.16 8.6 8.6 2.16-2.15-8.6-8.6z"
        fill="#5369FF"
      />
    </g>
  </svg>

  <p class="hits-empty-state-title">
    抱歉，无法找到结果。
  </p>
  <p class="hits-empty-state-description">
    请调整过滤项或查询关键词
  </p>
</div>
`

// 字段渲染
const fieldRender = {

    icons: {
        star: `<i class="fa fa-star" style="color:#FFAE2C;margin-right:0.2rem"></i>`,
        smile: `<i class="fa-solid fa-face-smile" style="color:#FFAE2C;margin-right:0.2rem"></i>`,
        heart: `<i class="fa-solid fa-heart" style="color:#F95018;margin-right:0.2rem"></i>`,
        thumbs: `<i class="fa-solid fa-thumbs-up" style="color:#FFAE2C;margin-right:0.2rem"></i>`,
    },

    isNumber: function (value) {
        if (typeof value != "string") return false
        return !isNaN(value) && !isNaN(parseFloat(value))
    },
    getSubstring: function (text, length) {
        return text.substring(0, length);
    },
    // 返回括号内容
    getBracketValue: function (value) {
        return /\(([^()]+)\)/g.exec(value)[1];
    },
    // 返回字段内容
    getFieldValue: function (field, hit) {
        if (field && typeof field === 'string') {
            const value = field.split('.').reduce((obj, key) =>
                (obj && obj[key] !== 'undefined') ? obj[key] : '', hit);
            return value && value + '' || '';
        } else {
            return '';
        }
    },
    // 对外的
    value: function (field, hit) {
        const b = field.indexOf('(');
        if (b > 0) {
            const func = field.substring(0, b).trim();
            return this[func] && this[func](field, hit);
        } else {
            const result = this.getFieldValue(field, hit);
            return result;
        }
    },

    // ================ 函数区域 ================

    // 高亮
    highlight: function (field, hit) {
        const pair = this.getBracketValue(field).split(',').map(item => item.trim());
        const fieldName = pair[0];
        const content = hit._highlightResult && hit._highlightResult[fieldName]?.value || this.getFieldValue(fieldName, hit);
        const length = pair[1];
        return length && this.getSubstring(content, length) || content;
    },
    // 删减
    substring: function (field, hit) {
        const pair = this.getBracketValue(field).split(',').map(item => item.trim());
        const fieldName = pair[0];
        const length = pair[1];
        const content = this.getFieldValue(fieldName, hit);
        len = length && length || 120;
        return this.getSubstring(content, len)
    },
    // 替换
    replace: function (field, hit) {
        const pair = this.getBracketValue(field).split(',').map(item => item.trim());
        const fieldName = pair[0];
        const key = pair[1];
        const value = pair[2];
        const content = this.getFieldValue(fieldName, hit);
        return content.replace(new RegExp(key, "ig"), value)
    },
    // 重复
    repeat: function (field, hit) {
        const pair = this.getBracketValue(field).split(',').map(item => item.trim());
        const fieldName = pair[0];
        const count = this.getFieldValue(fieldName, hit);
        let content = pair[1];
        content = this.icons[content] || content;
        return content.repeat(count);
    },
    // 日期格式化
    format: function (field, hit) {
        const pair = this.getBracketValue(field).split(',').map(item => item.trim());
        const fieldName = pair[0];
        const pattern = pair[1];
        const content = this.getFieldValue(fieldName, hit);
        return moment(content, this.isNumber(content) && "x").format(pattern);
    },
    // 图像加载
    image: function (field, hit) {
        const pair = this.getBracketValue(field).split(',').map(item => item.trim());
        const fieldName = pair[0];
        const style = pair[1];
        const url = this.getFieldValue(fieldName, hit);
        return `<img src=${url} ${style}/>`;
    },
}

const create = (obj) => {
    var elm = document.createElement(obj.type || 'div');
    if (obj.class) {
        elm.className = obj.class;
    }
    if (obj.innerHTML) {
        elm.innerHTML = obj.innerHTML
    }
    if (obj.src) {
        elm.src = obj.src;
    }
    if (obj.id) {
        elm.setAttribute("id", obj.id);
    }
    return elm;
}

// 过滤区
const createFilterContainer = () => {
    let filters = create({
        type: "div",
        class: "container-filters"
    })

    let clearDiv = create({
        type: "div",
        id: "clear-filters",
    });

    let filtersHeader = create({
        type: "div",
        class: "container-header"
    })

    let filtersIcon = create({
        innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000" class="bi bi-filter" viewBox="0 0 16 16">
        <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
      </svg>`
    })

    let filtersContiner = create({
        type: "div",
        id: "facets",
        class: "container-body"
    })

    filtersHeader.appendChild(filtersIcon);
    filtersHeader.appendChild(clearDiv)
    filters.appendChild(filtersHeader);
    filters.appendChild(filtersContiner);

    document.getElementById("facets-container").appendChild(filters);
}

/**
 * 渲染主场景
 */
const renderCanvas = (comp) => {
    let searchSettings = comp.searchSettings;
    const indexName = comp.index;

    // ======================================================================= //
    // ================================ 右侧头部 ============================== //
    // ======================================================================= //

    let rightHeaderContainer = document.getElementById("right-header-container");
    if (searchSettings?.sortAttributes?.length > 0 || searchSettings?.pagination?.enabled) {
        rightHeaderContainer.className = "container-header container-options";
    }

    // 排序组件
    const sortWidgets = [];
    let sorting;
    if (searchSettings?.sortAttributes?.length > 0) {
        /*  转换 sorting 放入 search_settings */
        sorting = { default: { field: '_score', order: 'desc' } };
        const fieldSorting = searchSettings.sortAttributes.reduce((a, v) => ({
            ...a,
            [`_${v.field}_desc`]: { field: v.field, order: 'desc' },
            [`_${v.field}_asc`]: { field: v.field, order: 'asc' }
        }), {})
        sorting = { ...sorting, ...fieldSorting };
        /* 
           1. 添加 html container
           2. 添加 sortBy widgets
            sortBy({
            container: '#sort-by',
            items: [
                { label: 'Featured', value: 'instant_search' },
                { label: 'Price (asc)', value: 'instant_search_price_asc' },
                { label: 'Price (desc)', value: 'instant_search_price_desc' },
            ],
            });   
        */
        searchSettings.sortAttributes.map(item => {
            const id = '_sortby_' + item.field;
            rightHeaderContainer.appendChild(create({
                id,
                class: "container-option"
            }))

            // Widgets
            sortWidgets.push(
                instantsearch.widgets.sortBy({
                    container: '#' + id,
                    items: [
                        { label: item.title, value: indexName },
                        { label: '从高到低', value: [indexName, item.field, 'desc'].join("_") },
                        { label: '从低到高', value: [indexName, item.field, 'asc'].join("_") },
                    ],
                }));
        })
    };

    // 分页组件
    const paginationWidget = [];
    const pageSizes = {
        "1": { min: 8, middle: 16, max: 32 },
        "2": { min: 12, middle: 24, max: 48 },
        "3": { min: 12, middle: 24, max: 48 },
        "4": { min: 16, middle: 32, max: 64 },
    }
    const pageSize = comp?.styles?.gridMaxColumns && pageSizes[comp?.styles?.gridMaxColumns + ""] || pageSizes["4"];
    if (searchSettings?.pagination?.enabled) {
        const pageContainer = create({
            id: "hits-per-page",
            class: "container-option",
        })
        rightHeaderContainer.appendChild(pageContainer);
        const items = [
            {
                label: `每页${pageSize.min}条`,
                value: pageSize.min,
                default: true,
            },
            {
                label: `每页${pageSize.middle}条`,
                value: pageSize.middle,
            },
            {
                label: `每页${pageSize.max}条`,
                value: pageSize.max,
            },
        ];
        paginationWidget.push(instantsearch.widgets.hitsPerPage({
            container: '#hits-per-page',
            items
        }));
    }
    // ======================================================================= //
    // ================================ 过滤组件  ============================= //
    // ======================================================================= //

    const refinementWidgets = [];
    var facet_attributes = [];

    if (searchSettings.facetAttributes && searchSettings.facetAttributes.length > 0) {
        createFilterContainer();
        /* 转化为search_settings's facet_attributes */
        facet_attributes = searchSettings.facetAttributes.map(item => ({
            ...item
        }));
        searchSettings = { ...searchSettings, facet_attributes };
        // 添加facet元素
        const facetsContainer = document.getElementById("facets");
        facetsContainer.classList.add('container-wrapper');
        searchSettings.facet_attributes?.map(facet => {
            var facetRooter = create({
                type: "div",
                class: "ais-Panel ais-Panel--collapsible"
            });
            // header
            var facetHeader = create({
                type: "div",
                class: "ais-Panel-header"
            });
            var facetHeaderTitle = create({
                type: "span",
                innerHTML: facet.title
            });
            facetHeader.appendChild(facetHeaderTitle);
            // body
            const elementId = facet.id;
            var facetBody = create({
                type: "div",
                class: "ais-Panel-body",
                id: elementId
            })
            facetRooter.appendChild(facetHeader);
            facetRooter.appendChild(facetBody);
            facetsContainer.appendChild(facetRooter);

            // 设置组件
            try {
                switch (facet.widget) {
                    case 'menu':
                        refinementWidgets.push(
                            instantsearch.widgets.menu({
                                container: '#' + elementId,
                                attribute: facet.attribute,
                                ...facet.config
                            }),
                        )
                        break;
                    case 'menuSelect':
                        refinementWidgets.push(
                            instantsearch.widgets.menuSelect({
                                container: '#' + elementId,
                                attribute: facet.attribute,
                                ...facet.config,
                                templates: {
                                    defaultOption(data, { html }) {
                                        return html`<span>所有的</span>`;
                                    },
                                },
                            },
                            ),
                        )
                        break;

                    case 'numericMenu':
                        try {
                            const items = JSON.parse(facet.config.json);
                            refinementWidgets.push(
                                instantsearch.widgets.numericMenu({
                                    container: '#' + elementId,
                                    attribute: facet.attribute,
                                    items
                                }),
                            )
                        } catch (e) {
                            console.error(e)
                        }

                        break;

                    case 'rangeSlider':
                        refinementWidgets.push(
                            instantsearch.widgets.rangeSlider({
                                container: '#' + elementId,
                                attribute: facet.attribute,
                                pips: false,
                                tooltips: true,
                                ...facet.config
                            }),
                        )
                        break;

                    case 'ratingMenu':
                        refinementWidgets.push(
                            instantsearch.widgets.ratingMenu({
                                container: '#' + elementId,
                                attribute: facet.attribute,
                                ...facet.config
                            }),
                        )
                        break;

                    case 'rangeInput':
                        refinementWidgets.push(
                            instantsearch.widgets.rangeInput({
                                container: '#' + elementId,
                                attribute: facet.attribute,
                                ...facet.config,
                            },
                            ),
                        )
                        break;

                    case 'toggleRefinement':
                        refinementWidgets.push(
                            instantsearch.widgets.toggleRefinement({
                                container: '#' + elementId,
                                attribute: facet.attribute,
                                ...facet.config,
                                templates: {
                                    labelText({ data }, { html }) {
                                        return html`<span>${facet?.config?.label}</span>`;
                                    },
                                },
                            },
                            ),
                        )
                        break;

                    default:
                        // list
                        refinementWidgets.push(
                            instantsearch.widgets.refinementList({
                                container: '#' + elementId,
                                attribute: facet.attribute,
                                ...facet.config,
                                templates: {
                                    showMoreText: `
                                  {{#isShowingMore}}
                                    收紧
                                  {{/isShowingMore}}
                                  {{^isShowingMore}}
                                    更多
                                  {{/isShowingMore}}
                                  `,
                                    searchableNoResults(data, { html }) {
                                        return html`<span>无结果</span>`;
                                    },
                                }
                            },
                            ),
                        )
                }
            } catch (e) {
                console.log(e);
            }

        });

        // 全局清除
        refinementWidgets.push(
            instantsearch.widgets.clearRefinements({
                container: '#clear-filters',
                templates: {
                    resetLabel({ hasRefinements }, { html }) {
                        return hasRefinements ? clearIcon : ''
                    },
                },
            })
        )

    }

    // ================================= //
    // ============= 加载 ============== //
    // ================================= //

    // 转换字段
    const replaceFieldExpr = (s, func) => {
        // let p = /{{\s*([\w+,#:-\s\.\(\)]+)\s*}}/g
        let p = /{{\s*(.*)\s*}}/g
        return s.replaceAll(p, function (match, g1, str) {
            return func(g1);
        });
    }
    const _FooTemplate = `
    <table class="table table-striped table-hover table-responsive">
      <thead>
        <tr>
          <th>Part Number</th>
          <th>Description</th>
          <th>Available Quantity</th>
        </tr>
      </thead>
      <tbody>
      {{#hits}}
        <tr>
          <td style="white-space:nowrap"><a href="{{ url }}">{{ code }}</a></td>
          <td>{{ description }}</td>
          <td>{{ quantityAvailable }}</td>
        </tr>
      {{/hits}}
      </tbody>
    </table>
  `;
    function templateFactory($hits) {
        return _FooTemplate;
    }

    // console.log(JSON.stringify(searchSettings));
    const sk = new Searchkit({
        connection: {
            host: endpoint,
            apiKey: comp.apikey
        },
        search_settings: {
            ...searchSettings,
            sorting,
        },
    })

    const search = instantsearch({
        indexName: indexName,
        searchClient: SearchkitInstantsearchClient(sk)
    });

    const renderHitHtml = (html, hit) => replaceFieldExpr(html, (field) => {
        try {
            return field && fieldRender.value(field.trim(), hit) || ''
        } catch (e) {
            console.error(e)
            return field;
        }
    });

    // 展示风格
    const hitsWidget = comp?.styles?.layout == 'table' ?
        // 表格模式
        instantsearch.connectors.connectHits(function (opts) {
            const hits = opts.hits;
            console.log('hits?.length:', hits?.length)
            console.log('opts:', opts)
            const columnHeaderRender = comp?.styles?.columns?.map(x => `<th ${x.width && 'width=' + x.width}>${x.label}</th>`).join("");
            const headers = `<thead><tr>${columnHeaderRender}</tr></thead>`;
            const content = hits.map(hit => `<tr>${comp?.styles?.columns?.map(x => `<td>${renderHitHtml(x.html, hit)}</td>`).join("")}</tr>`);
            const table = document.createElement("table");
            table.className = "styled-table";
            table.innerHTML = headers + content.join("");
            const container = document.querySelector("#hits");
            container.innerHTML = "";
            if (opts?.results && comp?.styles?.columns?.length > 0) {
                if (hits.length > 0) {
                    container.appendChild(table);
                    document.querySelector("#container").style = "max-width: max-content";
                } else {
                    container.appendChild(create({ innerHTML: emptyPageHtml }));
                }
            }
            // container.appendChild(create({ innerHTML: `<div class="hits-empty-state" style="min-width:600px">未定义列</div>` }));
        })() :
        // 栅格模式
        instantsearch.widgets.hits({
            container: "#hits",
            templates: {
                item(hit, { html, components }) {
                    return html`${renderHitHtml(comp?.styles?.hitHtml, hit)}`
                },
                empty(searchResults) {
                    const hasRefinements = searchResults.getRefinements().length > 0;
                    const description = hasRefinements
                        ? '尝试重置过滤器.'
                        : '请尝试其他的查询语句.';
                    return emptyPageHtml;
                }
            },
        });

    search.addWidgets([
        instantsearch.widgets.searchBox({
            container: "#searchbox",
            ...comp?.styles?.searchbox
        }),

        ...refinementWidgets,

        ...sortWidgets,

        ...paginationWidget,

        hitsWidget,

        instantsearch.widgets.pagination({
            container: "#pagination",
        })
    ]);

    search.start();
}

/**
 * 渲染样式
 */

const fr = (count, max) => {
    var r = '';
    for (var i = 0; i < Math.min(count, max); i++) {
        r += '1fr '
    }
    return r;
}

const renderStyle = (comp) => {
    let global = '';
    const globaStyles = document.createElement('style');
    // 主色
    if (comp?.styles?.primaryColor) {
        const colorCss = `
            .header {
                background: ${comp?.styles?.primaryColor}
            }
            .header_simple {
                background: ${comp?.styles?.primaryColor}
            }            
            .ais-Pagination-item--selected {
                background-color: ${comp?.styles?.primaryColor}
            }
            .ais-RangeSlider .rheostat-progress {
                background-color: ${comp?.styles?.primaryColor}
            }
            .ais-RefinementList-item--selected .ais-RefinementList-checkbox {
                background-color: ${comp?.styles?.primaryColor}
            }
            .ais-RatingMenu-starIcon--full {
                background-color: ${comp?.styles?.primaryColor}
            }
            .ais-ToggleRefinement-checkbox:checked {
                background-color: ${comp?.styles?.primaryColor}
            }
            `;
        global += colorCss;
    }
    // item 分栏
    if (comp?.styles?.gridMaxColumns) {
        const gridCss = `
                @media (min-width: 680px) {
                    .ais-Hits-list {
                    grid-template-columns: ${fr(comp?.styles?.gridMaxColumns, 2)};
                    }
                }
                @media (min-width: 900px) {
                    .ais-Hits-list {
                        grid-template-columns: ${fr(comp?.styles?.gridMaxColumns, 3)};
                    }
                }
                @media (min-width: 1200px) {
                    .ais-Hits-list {
                        grid-template-columns: ${fr(comp?.styles?.gridMaxColumns, 4)};
                    }
                }            
                `
        global += gridCss;
    }
    // 边框
    if (comp?.styles?.gridBorder) {
        const gridBorderCss = `
                .ais-Hits {
                    box-shadow: ${comp.styles.gridBorder};
                    ${comp.styles.gridBorder != 'none' && 'padding: 24px;'}  
                }
                `;
        global += gridBorderCss;
    }
    // banner 
    if (comp?.styles?.banner) {
        // 大幅
        if (comp?.styles?.banner?.background) {
            if (comp.styles.banner.background.startsWith('http')) {
                const bannerImage = `
                .header {
                    background-image: url(${comp?.styles?.banner?.background});
                    background-size: cover;
                }
                `;
                global += bannerImage;
            } else if (comp.styles.banner.background == 'standard') {
                // 标准，紧凑
                document.getElementById("header").classList.add('header_' + comp.styles.banner.background);
                const css = ` 
                .container-header {
                    min-height: 40px;
                }
                .container-options {
                    padding: 0;
                }
                `;
                global += css;
            } else if (comp.styles.banner.background == 'min') {
                document.getElementById("header").classList.add('header_min');
                const css = ` 
                .container-header {
                    min-height: 40px;
                }
                .container-options {
                    padding: 0;
                }
                .container {
                    padding: 1rem 1rem;
                }`;
                global += css;
            }
        }
        if (comp?.styles?.banner?.slogan_text) {
            let title = document.getElementById("header-title");
            title.innerHTML = comp?.styles?.banner?.slogan_text;
            if (comp?.styles?.banner?.slogan_color) {
                title.style.color = comp?.styles?.banner?.slogan_color;
            }
        }
        if (comp?.styles?.banner?.logo) {
            let logoContainer = document.getElementById("header-logo");
            let img = document.createElement('img');
            img.src = comp?.styles?.banner?.logo;
            img.style = "max-height:64";
            logoContainer.appendChild(img);
        }
    }

    if (global) {
        globaStyles.innerHTML = global;
        document.head.appendChild(globaStyles);
    }
}

// 加载配置
const renderByConfig = () => {
    const rootLayout = document.getElementById("root");
    const apikey = rootLayout.getAttribute('apikey');
    if (apikey != "undefined") {
        fetch(endpoint + '/api/component', { headers: { apikey } })
            .then(res => res.json())
            .then(comp => {
                renderCanvas(comp);
                renderStyle(comp);
                rootLayout.style.display = '';
            })
            .catch(e => rootLayout.appendChild(create({
                innerHTML: '加载失败' + e
            })));
    }
}

renderByConfig();
