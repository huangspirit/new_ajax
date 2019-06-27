 function new_ajax(opt) {
        this.buildQuery = (function f(obj,obj_key){
            var postData="";
            var my_key;
            var params = [];
            for (var key in obj){
                if(obj_key){
                    my_key=obj_key+"["+key+"]";
                }else{
                    my_key = key;
                }
                if((typeof obj[key]) =="object"){
                    params.push(f(obj[key],my_key));
                }else{
                    params.push(my_key + "=" + obj[key]);
                }
            }
            return params.join("&");
        });
        var xmlHttp = null;
        opt = opt || {};
        opt.method = opt.method || "POST";
        opt.url = opt.url || "";
        opt.async = opt.async || true;
        opt.data = opt.data || null;
        opt.success = opt.success || function () {};
        opt.error = opt.error || function () {};
        opt.timeout = opt.timeout || 3000;
        if(opt.method == "JSONP" || opt.method == "jsonp"){
            if(!opt.jsonp || typeof window[opt.jsonp] !=="function"){
                console.error("JSONP callback is not function");
                return ;
            }
            if(!opt.cbkn){
                opt.cbkn = "callback";
            }
            var script = document.createElement("script");
            if(opt.data){
                postData = this.buildQuery(opt.data);
                script.src = opt.url+"?"+postData+"&"+opt.cbkn+"="+opt.jsonp;
            }else{
                script.src = opt.url+"?"+opt.cbkn+"="+opt.jsonp;
            }
            document.body.insertBefore(script, document.body.firstChild);
            document.body.removeChild(document.body.firstChild);
            return;
        }
        if (XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        } else {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        if (opt.method === "POST"|| opt.method === "post") {
            if(opt.data){
                postData = this.buildQuery(opt.data);
            }else{
                console.error("POST Data is error...");
            }
            xmlHttp.open(opt.method, opt.url, opt.async);
            xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        }else  if (opt.method === "GET" || opt.method === "get") {
            if(opt.data){
                var postData = this.buildQuery(opt.data);
                xmlHttp.open(opt.method, opt.url + "?" + postData, opt.async);
            }else{
                xmlHttp.open(opt.method, opt.url , opt.async);
            }

        }else if (opt.method === "JSONP"){

        }
        if (opt.async){
            xmlHttp.timeout = opt.timeout;
            xmlHttp.ontimeout = function(){
                xmlHttp.abort();
                console.error("xhr is timeout");
            };
        }
        xmlHttp.onerror = function(){
            xmlHttp.abort();

        };
        xmlHttp.onload = function(){
            if(opt.complete!=undefined && typeof opt.complete =="function"){
                opt.complete();
            }

        };
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                var  backDate = JSON.parse(xmlHttp.responseText);
                opt.success(backDate);
            }else if (xmlHttp.readyState == 4 && xmlHttp.status != 200){
                xmlHttp.abort();
                opt.error(xmlHttp.status);
            }
        };
        if(opt.method === "POST"){
            xmlHttp.send(postData);
        }else{
            xmlHttp.send(null);
        }
    }