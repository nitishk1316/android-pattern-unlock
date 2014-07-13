var flipkart = (function () {
    var setting = {
        isRegister: true,
        isDraw : false,
        isFirst: true,
        isConfirm: false,
        startPoint: '',
        endPoint: ''
    };
    var pattern = [];
    var cPattern = [];
    var finalPattern = [];
    
    //If IndexOf function not Exist
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(obj, start) {
            for (var i = (start || 0), j = this.length; i < j; i++) {
                if (this[i] === obj) {
                    return i;
                }
            }
            return -1;
        }
    }
    
    //Notiifcation for every event
    function noitifcationMsg(msg) {
        var notification = document.getElementById('notify');
        notification.innerHTML = msg;
    }
    
    //Show Continue Button After initial Draw Pattern for Register
    function renderInitialContinueBox () {
        var buttons = document.getElementById('buttons');
        while (buttons.firstChild) {
            buttons.removeChild(buttons.firstChild);
        }
        var input = document.createElement('input');
        input.type = "button";
        input.value = "Continue";
        input.onclick = function () {
            return confirmPattern();
        };
        buttons.appendChild(input);
    }
    
    function renderConfirmContinueBox () {
        var buttons = document.getElementById('buttons');

        while (buttons.firstChild) {
            buttons.removeChild(buttons.firstChild);
        }

        var input = document.createElement('input');
        input.type = "button";
        input.value = "Continue";
        input.onclick = function () {
            return savePattern();
        };

        buttons.appendChild(input);
		
    }

    function hideContinueBox() {
        var buttons = document.getElementById('buttons');
        while (buttons.firstChild) {
            buttons.removeChild(buttons.firstChild);
        }
    }
    //Show Lines - Vertical/Horizontal/Diagonal
    function showLines() {
        var line = document.getElementById('line-' + setting.start + setting.end);
        if (setting.end <  setting.start){
            line = document.getElementById('line-' + setting.end + setting.start);
        }
        line.style.visibility = "visible";
    }
    
    //Save Pattern After Success
    function savePattern () {
        finalPattern = JSON.parse(JSON.stringify(cPattern));
        pattern = [];
        reset();
        noitifcationMsg("Draw Pattern to unlock");	
        var buttons = document.getElementById('buttons');
        while (buttons.firstChild) {
            buttons.removeChild(buttons.firstChild);
        }
    }
    //Match Two Array
    function matchArray(array1, array2) {
        var l1 = array1.length;
        for(var i = 0; i < l1;  i++) {
            if(array1[i] !== array2[i]) {
                return false;
            }
        }
        return true;
    }

    //Messgae and Reset Patter for Confirm
    function confirmPattern() {
        setting.isConfirm = true;
        reset();
        noitifcationMsg("Draw pattern again to confirm");
    }

    //Reset
    function reset() {
        var i = 0;
        for (i = 1; i < 10; i++){
            var btn = document.getElementById("btn-" + i);
            btn.className = "";
            btn.className = "pattern-btn";
        }
        var l = getElementsByClassName (document, 'h-lines').length;
        for(i=0;i < l;i++){
            getElementsByClassName (document, "h-lines")[i].style.visibility="hidden"
        }

        l = getElementsByClassName (document, "v-lines").length;
        for(i=0;i < l;i++){
            getElementsByClassName (document, "v-lines")[i].style.visibility="hidden"
        }

        l = getElementsByClassName (document, "d1-lines").length;
        for(i=0;i < l;i++){
            getElementsByClassName (document, "d1-lines")[i].style.visibility="hidden"
        }

        l = getElementsByClassName (document, "d1-lines").length;
        for(i=0;i < l;i++){
            getElementsByClassName (document, "d1-lines")[i].style.visibility="hidden"
        }
    }
    
    function touchStart (that) {
        reset();
        pattern = [];
        

        setting.isDraw = true;
        pattern.push(that.id); 
        var d = document.getElementById(that.id);
        d.className = d.className + " active";

        setting.start = "";
        setting.end = that.id.split("-")[1];

        if(setting.isRegister) {
            noitifcationMsg("Relase Mouse when done");	
        }
    }
    function touchOver (that) {
        if(setting.isDraw) {
            var index = pattern.indexOf(that.id) ;
            if( index == -1 ) {
                pattern.push(that.id); 
                var d = document.getElementById(that.id);
                d.className = d.className + " active";

                setting.start = setting.end;
                setting.end = that.id.split("-")[1];
                showLines();
            }
        }
        return false;
    }
    function touchEnd(that) {
        setting.isDraw = false;
        var isMatch;
        if(setting.isRegister) {
            if(setting.isConfirm) {
                        
                isMatch = matchArray(pattern, cPattern);

                if(isMatch) {
                    setting.isRegister = false;
                    noitifcationMsg("Your new unlock pattern");	
                    renderConfirmContinueBox();

                } else{
                    hideContinueBox();
                    noitifcationMsg("Sorry, try again");	
                    setTimeout(function() {
                        pattern = [];
                        reset();
                    }, 1000);
                }
            } else {
                noitifcationMsg("pattern recorded");	
                cPattern = JSON.parse(JSON.stringify(pattern));
                pattern = [];
                renderInitialContinueBox();
            }
			
        } else {
            isMatch = matchArray(finalPattern, pattern);

            if(isMatch) {
                noitifcationMsg("Congratulation, You unlocked the pattern");	
                pattern = [];
                reset();
            } else{
                noitifcationMsg("Sorry, try again");	
                setTimeout(function() {
                    pattern = [];
                    reset();
                }, 1000);
            }
        }

    }
    //Initialize App
    function init() {
        var i;
        for (i = 1; i < 10; i++){
            var btn = document.getElementById("btn-" + i);
            //On START
            btn.onmousedown = function(e){
                if (!e){
                    var e = window.event;
                }else{
                    e.preventDefault();
                }
                touchStart(this);
            };
            //On OVER
            btn.onmouseover = function(){ //console.log(this.id); 
                touchOver(this);
            };
            //On END
            btn.onmouseup = function(){
                touchEnd(this);
            }; 
            
            btn.ontouchstart = function(e){
                if (!e) var e = window.event;
                e.preventDefault();
                touchStart(this);
            }; 
            btn.ontouchmove = touchOver;
            btn.ontouchend = function(){
                touchEnd(this);
            }; 
            
        }
    }
    
    function getElementsByClassName(node, classname) {
        var a = [];
        var re = new RegExp('(^| )'+classname+'( |$)');
        var els = node.getElementsByTagName("*");
        for(var i=0,j=els.length; i<j; i++)
            if(re.test(els[i].className))a.push(els[i]);
        return a;
    }
    return {
        init: init,
        confirmPattern: confirmPattern  
    }

}());

flipkart.init();
