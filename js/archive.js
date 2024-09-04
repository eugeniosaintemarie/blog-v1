(function () {
  function queryString() {
    let queryObj = {};
    const queryStr = window.location.search.substring(1);
    const queryArr = queryStr.split('&');

    queryArr.forEach(pairStr => {
      const pair = pairStr.split('=');
      const key = pair[0];
      const value = pair[1] || '';

      if (typeof queryObj[key] === 'undefined') {
        queryObj[key] = value;
      } else if (typeof queryObj[key] === 'string') {
        queryObj[key] = [queryObj[key], value];
      } else {
        queryObj[key].push(value);
      }
    });

    return queryObj;
  }

  const setUrlQuery = (function () {
    const baseUrl = window.location.href.split('?')[0];
    return function (query) {
      const newUrl = typeof query === 'string' ? baseUrl + query : baseUrl;
      window.history.replaceState(null, '', newUrl);
    };
  })();

  $(document).ready(function () {
    const $tags = $('.js-tags');
    const $articleTags = $tags.find('.tag-button');
    const $tagShowAll = $tags.find('.tag-button--all');
    const $result = $('.js-result');
    const $sections = $result.find('section');
    const sectionArticles = [];
    let $lastFocusButton = null;
    const sectionTopArticleIndex = [];
    let hasInit = false;

    $sections.each(function () {
      sectionArticles.push($(this).find('.item'));
    });

    function init() {
      let index = 0;
      $sections.each(function (i) {
        sectionTopArticleIndex.push(index);
        index += $(this).find('.item').length;
      });
      sectionTopArticleIndex.push(index);
    }

    function searchButtonsByTag(_tag) {
      if (!_tag) return $tagShowAll;
      const _buttons = $articleTags.filter('[data-encode="' + _tag + '"]');
      return _buttons.length === 0 ? $tagShowAll : _buttons;
    }

    function buttonFocus(target) {
      if (target) {
        target.addClass('focus');
        $lastFocusButton && !$lastFocusButton.is(target) && $lastFocusButton.removeClass('focus');
        $lastFocusButton = target;
      }
    }

    function tagSelect(tag, target) {
      const result = {};

      sectionArticles.forEach(($articles, i) => {
        $articles.each((j) => {
          const tags = $articles.eq(j).data('tags').split(',');
          if (!tag || tags.includes(tag)) {
            result[i] = result[i] || {};
            result[i][j] = true;
          }
        });
      });

      $sections.each((i) => {
        const sectionResult = result[i];
        sectionResult ? $sections.eq(i).removeClass('d-none') : $sections.eq(i).addClass('d-none');
        sectionArticles[i].each((j) => {
          sectionResult && sectionResult[j] ? sectionArticles[i].eq(j).removeClass('d-none') : sectionArticles[i].eq(j).addClass('d-none');
        });
      });

      if (!hasInit) {
        $result.removeClass('d-none');
        hasInit = true;
      }

      if (target) {
        buttonFocus(target);
        const _tag = target.attr('data-encode');
        _tag ? setUrlQuery(`?tag=${_tag}`) : setUrlQuery();
      } else {
        buttonFocus(searchButtonsByTag(tag));
      }
    }

    const query = queryString();
    const _tag = query.tag;

    init();
    tagSelect(_tag);

    $tags.on('click', 'a', function () {
      tagSelect($(this).data('encode'), $(this));
    });

  });
})();
