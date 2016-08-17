var $=require('jquery');
var jqueryui=require('jquery-ui');
var html2canvas=require('html2canvas');

if(!HTMLCanvasElement.prototype.toBlob){
  HTMLCanvasElement.prototype.toBlob = function(callback, type, encoderOptions){
    var dataurl = this.toDataURL(type, encoderOptions);
    var bstr = atob(dataurl.split(',')[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    var blob = new Blob([u8arr], {type: type});
    callback.call(this, blob);
  };
}
var webclip = function(posturl){
  $('<link>', {rel: 'stylesheet', type: 'text/css',
    href: "https://code.jquery.com/ui/1.12.0/themes/ui-lightness/jquery-ui.css"
  }).appendTo('head');
  var el=$('<div>').css({
    width: "200px",height:"200px",position:"absolute",
    border:"4px solid red",top:window.scrollY,left:window.scrollX,
    "background-color": "darkgray",opacity: 0.7,
    "z-index":"1000000"}).resizable().draggable().appendTo('body');
  var elimg =$("<img>",{src:"data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDEwMCAxMDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMzJweCIgaGVpZ2h0PSIzMnB4Ij4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNTAsNDBjLTguMjg1LDAtMTUsNi43MTgtMTUsMTVjMCw4LjI4NSw2LjcxNSwxNSwxNSwxNWM4LjI4MywwLDE1LTYuNzE1LDE1LTE1ICAgIEM2NSw0Ni43MTgsNTguMjgzLDQwLDUwLDQweiBNOTAsMjVINzhjLTEuNjUsMC0zLjQyOC0xLjI4LTMuOTQ5LTIuODQ2bC0zLjEwMi05LjMwOUM3MC40MjYsMTEuMjgsNjguNjUsMTAsNjcsMTBIMzMgICAgYy0xLjY1LDAtMy40MjgsMS4yOC0zLjk0OSwyLjg0NmwtMy4xMDIsOS4zMDlDMjUuNDI2LDIzLjcyLDIzLjY1LDI1LDIyLDI1SDEwQzQuNSwyNSwwLDI5LjUsMCwzNXY0NWMwLDUuNSw0LjUsMTAsMTAsMTBoODAgICAgYzUuNSwwLDEwLTQuNSwxMC0xMFYzNUMxMDAsMjkuNSw5NS41LDI1LDkwLDI1eiBNNTAsODBjLTEzLjgwNywwLTI1LTExLjE5My0yNS0yNWMwLTEzLjgwNiwxMS4xOTMtMjUsMjUtMjUgICAgYzEzLjgwNSwwLDI1LDExLjE5NCwyNSwyNUM3NSw2OC44MDcsNjMuODA1LDgwLDUwLDgweiBNODYuNSw0MS45OTNjLTEuOTMyLDAtMy41LTEuNTY2LTMuNS0zLjVjMC0xLjkzMiwxLjU2OC0zLjUsMy41LTMuNSAgICBjMS45MzQsMCwzLjUsMS41NjgsMy41LDMuNUM5MCw0MC40MjcsODguNDMzLDQxLjk5Myw4Ni41LDQxLjk5M3oiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K"}).css({
    display: "block",
    margin: "0 auto"});
  el.append(elimg);
  $(document).keyup(function(e) {
    if (e.keyCode == 27) { // ESC
      el.remove();
    }
  });
  elimg.on('click',function(e){
    $(e.target).remove();
    var url = window.location.href;
    var posx=el.position().left+window.scrollX, width =el.width();
    var posy=el.position().top +window.scrollY, height=el.height();
    var wi = window.open('about:blank',"",'width=800,height=600');
    // キャプチャ
    html2canvas(document.body
    ).then(function(canvas) {
      el.remove();
      canvas.toBlob(
        function(blob){
          var formData = new FormData();
          formData.append("image[image_file]", blob, "capture.jpg");
          $.ajax(posturl+'/sys/images/upload',{
            method:'POST', contentType: false, processData: false,dataType: 'json',
            data: formData
          }).done(function(json){
            var imgurl = json.url;
            url = "/sys/ud/corpus/new?"+
            jQuery.param({nomenu: "true",
             "udoc[capture_url]": imgurl,
             "udoc[user_agent]": navigator.userAgent,
             "udoc[pos_from][x]": posx,
             "udoc[pos_from][y]": posy,
             "udoc[pos_to][x]": posx+width,
             "udoc[pos_to][y]": posy+height,
             "udoc[url]": window.location.href});
            wi.location.href=posturl+url;
          })
        },'image/jpeg',0.8
      );
    }).catch(function(err){
      alert(err);
    });
  });
};
