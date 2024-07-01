(function() {
  // Ensure this script is running in the browser
  if (typeof window !== 'undefined') {
    const scriptTag = document.currentScript;
    const companySlug = scriptTag.getAttribute('data-id');

    // Create a container div for the widget
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'widget-container';
    document.body.appendChild(widgetContainer);
    widgetContainer.style.position = 'fixed';
    widgetContainer.style.bottom = '1px';
    widgetContainer.style.right = '1px';
    widgetContainer.style.width = '100vw'; // or set a specific width if needed
    widgetContainer.style.height = '100vh'; // or set a specific height if needed
    widgetContainer.style.zIndex = '1000'; // Ensure it appears above other content

    // Create an iframe to load the widget content
    const iframe = document.createElement('iframe');
    iframe.src = `http://localhost:3001/${companySlug}/widget`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    
    // Append the iframe to the widget container
    widgetContainer.appendChild(iframe);
  }
})();
