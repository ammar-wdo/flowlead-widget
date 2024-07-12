
(function() {
  const scriptTag = document.currentScript;
      const companySlug = scriptTag.getAttribute('data-id');


  function injectCSS() {
    const style = document.createElement('style');
  
    style.innerHTML = `
      .no-scroll-flowlead-widget {
        overflow: hidden !important;
      }
    `;
    document.head.appendChild(style);
  }


  function setIframeSize(iframe) {
    const width = window.innerWidth;
    if (width < 600) {
      iframe.style.width = '100vw';
      iframe.style.height = '100vh';
      iframe.style.bottom = '0px';
      iframe.style.right = '0px'
      document.body.classList.add('no-scroll-flowlead-widget')
    } else if (width >= 600 && width < 1200) {
      iframe.style.width = '400px';
      iframe.style.height = '90vh';
 
    } else if(width > 1200 && width < 1700) {
      iframe.style.width = '400px';
      iframe.style.height = '90vh';
  
    }
    else if (width >= 1700) {
      iframe.style.width = '500px';
      iframe.style.height = '90vh';
   
    }
  }

  function createChatWidget() {
    var iframe = document.createElement('iframe');
    iframe.src = `http://localhost:3001/${companySlug}/widget`;
    
    iframe.style.position = 'fixed';
    iframe.style.bottom = window.innerWidth < 600 ? '10px' : '20px';  // Initial bottom position
    iframe.style.right = window.innerWidth < 600 ? '10px' : '20px';   // Initial right position
    iframe.style.width = '150px'; // Minimized button size
    iframe.style.height = '50px'; // Minimized button size
    iframe.style.border = 'none';
    iframe.style.zIndex = '9999';
   
     iframe.style.borderRadius="6px"
 
     iframe.style.overflow='hidden'
     iframe.style.display = 'none'; 
    document.body.appendChild(iframe);

        // Inject CSS to disable scrolling
        injectCSS();

    // Listen to messages from the iframe to toggle the widget size
    window.addEventListener('message', (event) => {
      if (event.data.type === 'widget-ready') {
      iframe.style.backgroundColor = event.data.color
      iframe.style.display = 'block';
       
      }
      if (event.data === 'open-widget') {
        setIframeSize(iframe);
        iframe.style.borderRadius="25px"
      ;
          
     
        
      } else if (event.data === 'close-widget') {
        iframe.style.width = '150px';
        iframe.style.height = '50px';
        iframe.style.borderRadius = '6px';
        document.body.classList.remove('no-scroll-flowlead-widget')
        iframe.style.bottom = window.innerWidth < 600 ? '10px' : '20px';  // Initial bottom position
        iframe.style.right = window.innerWidth < 600 ? '10px' : '20px';
   
      }
    });

 
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    createChatWidget();
  } else {
    document.addEventListener('DOMContentLoaded', createChatWidget);
  }
})();
