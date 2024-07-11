
(function() {
  const scriptTag = document.currentScript;
      const companySlug = scriptTag.getAttribute('data-id');
  function setIframeSize(iframe) {
    const width = window.innerWidth;
    if (width < 600) {
      iframe.style.width = '98vw';
      iframe.style.height = 'calc(100vh - 20px)';
      iframe.style.bottom = '3px';
      iframe.style.right = '3px'
    } else if (width >= 600 && width < 1200) {
      iframe.style.width = '400px';
      iframe.style.height = '90vh';
    } else {
      iframe.style.width = '500px';
      iframe.style.height = '90vh';
    }
  }

  function createChatWidget() {
    var iframe = document.createElement('iframe');
    iframe.src = `https://flowlead-widget.vercel.app/${companySlug}/widget`;
    
    iframe.style.position = 'fixed';
    iframe.style.bottom = window.innerWidth < 600 ? '3px' : '20px';  // Initial bottom position
    iframe.style.right = window.innerWidth < 600 ? '3px' : '20px';   // Initial right position
    iframe.style.width = '150px'; // Minimized button size
    iframe.style.height = '50px'; // Minimized button size
    iframe.style.border = 'none';
    iframe.style.zIndex = '1000';
    iframe.style.transition = 'width 0.3s, height 0.3s'; // Smooth transition
     iframe.style.borderRadius="6px"
 
     iframe.style.overflow='hidden'
     iframe.style.display = 'none'; 
    document.body.appendChild(iframe);

    // Listen to messages from the iframe to toggle the widget size
    window.addEventListener('message', (event) => {
      if (event.data.type === 'widget-ready') {
      iframe.style.backgroundColor = event.data.color
      iframe.style.display = 'block';
        console.log('Widget color:', event.data.color);  // Log the color or use it as needed
      }
      if (event.data === 'open-widget') {
        setIframeSize(iframe);
        iframe.style.borderRadius="25px"
      } else if (event.data === 'close-widget') {
        iframe.style.width = '150px';
        iframe.style.height = '50px';
        setTimeout(() => {
          iframe.style.borderRadius = '6px';
        }, 300)
      }
    });

    // Adjust iframe size on window resize
    // window.addEventListener('resize', () => {
    //   if (iframe.style.width !== '50px') {
    //     setIframeSize(iframe);
    //   }
    // });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    createChatWidget();
  } else {
    document.addEventListener('DOMContentLoaded', createChatWidget);
  }
})();
