/// <reference path="data.js" />

//Define
function showOptions(optionsObj) {
    var skills = optionsObj.notification_skills;
    var skill;
    for (var i = 0; i < skills.length; i++) {
        skill = all_skills[skills[i]];
        selectSkill(skill.id, skill.name, skill.category_id, jQuery('#' + skill.id));
    }
    jQuery('#notification_show').prop('checked', optionsObj.notification_show);
    jQuery('#notification_priority').val(optionsObj.notification_priority);
    jQuery('#notification_ignore_uname').val(optionsObj.notification_ignore_uname);
    jQuery('#notification_ignore_title').val(optionsObj.notification_ignore_title);
    jQuery('#notification_ignore_content').val(optionsObj.notification_ignore_content);
    jQuery('#notification_ignore_currency').val(optionsObj.notification_ignore_currency);
    jQuery('#notification_time_clear').val(optionsObj.notification_time_clear);
    jQuery('#notification_format').val(optionsObj.notification_format);
    jQuery('#notification_truncate').val(optionsObj.notification_truncate);
    jQuery('#notification_sound_play').prop('checked', optionsObj.notification_sound_play);
    jQuery('#notification_sound_type').val(optionsObj.notification_sound_type);
    jQuery('#notification_sound_volume').val(optionsObj.notification_sound_volume); 
    jQuery('#notification_startup').prop('checked', optionsObj.notification_startup);
    jQuery('#notification_welcome').prop('checked', optionsObj.notification_welcome);
}

function selectSkill(skill_id, skill_name, skill_cat, liobj) {
    liobj.addClass('disabled');
    var parentA = jQuery('<span class="selected-bubbles"><a data-skill_id="' + skill_id + '" id="selected_skill_' + skill_id + '" class="label label-info selected_skill"><span>×</span>' + skill_name + '</a></span>');
    parentA.find('a').click(removeLang);
    jQuery('#selected_skills-' + skill_cat).append(parentA);
}
changeLanguage = function (a) {
    var liobj = jQuery(a.currentTarget);
    if (liobj.attr('class').indexOf('disabled') <= 0) {
        var skill_id = this.id, skill_name = liobj.text().trim(), skill_cat = liobj.data('cat');
        selectSkill(skill_id, skill_name, skill_cat, liobj);
        //Save 
    }
    return !1;


},
showLanguages = function (ev) {
    var catid = jQuery(ev.currentTarget).data('cat');
    var thisbox = jQuery('#skill_wrap-' + catid).show();
    thisbox.find('.skills').each(function () {
        jQuery('#selected_skill_' + this.id).length ? jQuery(this).addClass('disabled') : jQuery(this).removeClass('disabled');
    });
},
hideLanguages = function (ev) {
    var catid = jQuery(ev.currentTarget).data('cat');
    jQuery('#skill_wrap-' + catid).hide();
};
handleLanguagesKeyIns = function (a) {
    a || (a = window.Event);
    if (a.keyCode == 13) return !1
},
filterLanguages = function (a) {
    a || (a = window.Event), _input = jQuery(a.currentTarget), showLanguages(a), a.keyCode == 27 && $el.val(''), _findLanguages(_input.val(), _input.data('cat'))
},
_findLanguages = function (searchString, catid) {
    //jQuery('.skill').show();
    jQuery('#skill_wrap-' + catid + '>ul>li.skills a').each(function () {
        jQuery(this).html().toLowerCase().indexOf(searchString.toLowerCase()) != -1 ? jQuery(this).show() : jQuery(this).hide()
    })
},
removeLang = function (a) {
    var catobj = jQuery(a.currentTarget);
    jQuery('#' + catobj.data('skill_id')).removeClass('disabled');
    catobj.parent().remove();

}
function saveData() {
    var notification_skills = [];
    $('.selected-bubbles>a').each(function () {
        notification_skills[notification_skills.length] = $(this).data('skill_id');
    });
    var notification_show = jQuery('#notification_show').prop('checked');
    var notification_priority = jQuery('#notification_priority').val();
    var notification_ignore_uname = jQuery('#notification_ignore_uname').val();
    var notification_ignore_title = jQuery('#notification_ignore_title').val();
    var notification_ignore_content = jQuery('#notification_ignore_content').val();
    var notification_ignore_currency = jQuery('#notification_ignore_currency').val();
    var notification_time_clear = jQuery('#notification_time_clear').val(); 
    var notification_format = jQuery('#notification_format').val();
    var notification_truncate = jQuery('#notification_truncate').val();
    var notification_sound_play = jQuery('#notification_sound_play').prop('checked');
    var notification_sound_type = jQuery('#notification_sound_type').val();
    var notification_sound_volume = jQuery('#notification_sound_volume').val(); 
    var notification_welcome = jQuery('#notification_welcome').prop('checked');
    var notification_startup = jQuery('#notification_startup').prop('checked');
    var saveObj = {
        'notification_skills': notification_skills,
        'notification_show': notification_show,
        'notification_priority': notification_priority,
        'notification_ignore_uname': notification_ignore_uname,
        'notification_ignore_title': notification_ignore_title,
        'notification_ignore_content': notification_ignore_content,
        'notification_ignore_currency': notification_ignore_currency,
        'notification_time_clear': notification_time_clear,
        'notification_format': notification_format,
        'notification_truncate': notification_truncate,
        'notification_sound_play': notification_sound_play,
        'notification_sound_type': notification_sound_type,
        'notification_sound_volume': notification_sound_volume,
        'notification_welcome': notification_welcome,
        'notification_startup': notification_startup
    };
    chrome.storage.local.set({ 'options': saveObj }, function (data) {
        chrome.runtime.sendMessage({ _method: "updateConfig", options: saveObj }, function (_error) {
            if (_error) {
                alert('Can not update apply config. Please stop and start');
            } else {
                alert('Save and Apply success');
            }
            //window.top.close();
        });
    });
}
function resetData() {
    if (confirm('Are you sure ?')) {
        chrome.storage.local.remove('options', function () {
            location.reload();
        });
    }
}
function LoadData() {
    chrome.storage.local.get('options', function (data) {
        var options = data['options'] || optionsDefault;
        showOptions(options);
    });
}
//Call function
//show category
var cat;
var skill;
for (var _key2 in all_skills) {
    skill = all_skills[_key2];
    all_categories[skill.category_id].html += '<li class="skills" id="' + _key2 + '" data-cat="' + skill.category_id + '"  style="cursor:pointer;" ><a class="pad" style="color: rgb(51, 51, 51); display: block;">' + skill.name + '</a></li>';
}
for (var _key in all_categories) {
    cat = all_categories[_key];
    var boxHtml = '<div class="box cat"><span class="span5 margin-l0 margin-t5" >'
        + cat.name + '</span><div class="span5 margin-l0 left">'
        + '<div class="bucket-search-wrapper"><input id="input-skill-' + _key + '" data-cat="' + _key
        + '" class="search-input" placeholder="Add skills ..."><i class="top-5 search-icon"></i></div>'
    + '<div id="skill_wrap-' + _key + '"  data-cat="' + _key + '" class="select_wrap" style="width: 200px; display: none;">'
    + '<ul class="nav nav-list">' + cat.html + '</ul></div></div>'
    + '<div class="control-group"><div class="controls span6 margin-l0 margin-t5">'
    + '<div id="selected_skills-' + _key + '" data-cat="' + _key + '"></div><span class="help-inline small"></span></div></div></div>';

    jQuery('#boxs').append(boxHtml);
}
LoadData();
//reg event
jQuery('.skills:not(.disabled)').mousedown(changeLanguage);
jQuery('input[id^="input-skill-"').focusin(showLanguages);
jQuery('input[id^="input-skill-"').focusout(hideLanguages);
jQuery('input[id^="input-skill-"').keydown(handleLanguagesKeyIns);
jQuery('input[id^="input-skill-"').keyup(filterLanguages);
jQuery('.btnSave.save').click(saveData);
jQuery('.btnSave.reset').click(resetData);