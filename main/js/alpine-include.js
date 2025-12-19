/*
  Alpine x-include directive
  - Fetches an HTML partial and replaces the host element with its content.
  - Calls Alpine.initTree on the injected fragment to activate Alpine directives.
  - Dispatches a custom 'x-include:loaded' event so downstream logic (e.g., i18n) can re-apply translations on newly injected nodes.
*/
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

        // Notify that new content has been injected for i18n to reapply
        try {
          document.dispatchEvent(new CustomEvent('x-include:loaded', { detail: { url } }));
        } catch (_) {}
      });
  });
});
