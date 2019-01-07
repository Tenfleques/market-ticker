function toggleSmallScreenNavControl(){
	/**
	 * enables the click event on the small screen hamburger and click event on the link inside the sidemenu described by the class link-goto
	 */
	// small screen navigation events 
	$('#nav-icon').click(function(){
		$(this).toggleClass('open');
		$(".ham-container").toggleClass("border border-left-0 border-right-0 border-dark open pr-4");
		$(".left,.ham-title").toggleClass('open');
		$("body").toggleClass("frozen");
	});
	// close navigation sidebar after sidemenu link click
	$(".sidemenu.left").on("click",".link-goto",function(){
		$("#nav-icon").toggleClass('open');
		$(".ham-container").toggleClass("border border-left-0 border-right-0 border-dark open pr-4");
		$(".left,.ham-title").toggleClass('open');
		$("body").toggleClass("frozen");
	})
}  
function internationale(){
	/**
	 * Controls the active language and memory management of user preferred language
	 */
	var lang = getCookie("lang");
	if(lang==""){
		setCookie("lang","en",365);
		lang = "en";
	}			
	$(".lang").addClass("hidden");
	$(".lang").css("visibility","visible");
	$(".lang."+lang).removeClass("hidden");
}	
function toggleInternationale(){
	/** 
	 *  reads the selected language in the triggering control, updates the user preferred language and calls the language control function `internationale`
	 */
	var lang = $(this).find(":selected").text();
	setCookie("lang",lang,365);
	internationale();
}	
function initInternationalization(){
	/**
	 * initilize the language settings
	 */
	var lang = getCookie("lang");
	$(".international").val(lang);
	internationale();
	$(".international").on("change",toggleInternationale)
}

function wideScreenNavItem(navItem){
	/**
	 * prepares the html for the navigation item respectve to wide screens
	 */
    html = '<li class="nav-item link-box" >';
    html +='    <a class="nav-link text-right link-goto '+navItem.active+'" href="'+navItem.url+'" role="button" aria-expanded="false">';
    for(lan in navItem.caption)
        html +='        <span class = "hidden lang '+lan+'">'+navItem.caption[lan]+'</span> ';
    html +='    </a>';
    html +='</li>';
    return html;
}
function smallScreenNavItem(navItem){
	/**
	 * prepares the html for the navigation item respectve to smaller screens
	 */
    html = '<a href="'+navItem.url+'" class="list-group-item list-group-item-action m-0 pl-1 text-dark border-0 link-goto bg-transparent '+navItem.active+'">';
    for(lan in navItem.caption)
        html +='        <span class = "hidden lang '+lan+'">'+navItem.caption[lan]+'</span> ';
    html +='</a>';
    return html;
}
function fillNavs(navData,func){
    /** 
	 * require json array of navigation items. 
     * creates html of navigation items and populate the respective navigation areas
     * 
    */
    var smallScreensNavs = "", //html for smaller screens 
        wideScreenNavs = ""; //html for wider screens

    for (var i in navData){
        smallScreensNavs += smallScreenNavItem(navData[i]);
        wideScreenNavs += wideScreenNavItem(navData[i]);
    }
    
    $(".wide-screen-nav").html(wideScreenNavs).on("click", "a", func); //populates widescreen navigation
    $(".small-screen-nav").html(smallScreensNavs).on("click", "a", func); //populates smallscreen navigation
}

$(function(){
	//update copyrights sections
	$(".copyright-date").html((new Date().getFullYear()));
	//update app title
	
	var app = $.getJSON("/bin/model/details/");
	app.done(function(appData){	
		$("title").html(appData.title);
		for (var langTitle in appData.localTitle){
			//populate all the title instances with respective language titles
			$(".title." + langTitle).html(appData.localTitle[langTitle]);
			//populate all the description fields
			$(".app-description."+langTitle).html(appData.description[langTitle]);

		}
		initInternationalization();
	})
	app.fail(ajaxExceptionhandler);	
})