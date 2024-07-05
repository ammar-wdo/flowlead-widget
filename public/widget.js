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
    widgetContainer.style.bottom = '10px';
    widgetContainer.style.right = '10px';
    widgetContainer.style.width = '1100px'; // Set a specific width
    widgetContainer.style.height = '100vh'; // Set a specific height
    widgetContainer.style.zIndex = '1000'; // Ensure it appears above other content
 
    widgetContainer.style.backgroundColor = 'transparent'
 
 

    // Create an iframe to load the widget content
    const iframe = document.createElement('iframe');
    iframe.src = `https://flowlead-widget.vercel.app/${companySlug}/widget`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    
    // Append the iframe to the widget container
    widgetContainer.appendChild(iframe);
  }
})();
