document.addEventListener('alpine:init', () => {
  Alpine.directive('include', (el, { expression }, { evaluate }) => {
    const url = evaluate(expression);

    fetch(url)
      .then(r => r.text())
      .then(html => {
        // Parse HTML into a fragment
        const fragment = document
          .createRange()
          .createContextualFragment(html);
        
        // Replace the element with the fetched content
        el.replaceWith(fragment);

        // Initialize Alpine in the injected content
        if (Alpine.initTree) {
          Alpine.initTree(fragment);
        }
      });
  });
});
