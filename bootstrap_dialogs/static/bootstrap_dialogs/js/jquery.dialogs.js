/*
* Dialogs; v20140104
* https://github.com/yceruto/bootstrap-dialogs
* Copyright (c) 2014 Yonel Ceruto Glez
*/

if (typeof jQuery === "undefined") { throw new Error("Dialogs requires jQuery") }

const DIALOG_INFORMATION = DIALOG_PRIMARY = 0,
      DIALOG_QUESTION = DIALOG_INFO = 1,
      DIALOG_SUCCESS = 2,
      DIALOG_WARNING = 3,
      DIALOG_EXCLAMATION = DIALOG_DANGER= 4,
      DIALOG_INVERT = 5;

/**
 * @example
 * DialogBox('Buy?', {
 *    type: DIALOG_QUESTION,                         //Default DIALOG_INFORMATION
 *    title: 'Question',                             //Default 'Information'
 *    buttons: {'Yes': function(){...}, 'No': null}, //Default OK button
 *    onClose: function(){...}                       //Default null
 * })
 *
 */
var DialogBox = function (content, options) {
    if (!$.isPlainObject(options))
        options = {};

    options = $.extend({}, DialogBox.DEFAULTS, options);

    var $modal = $(options.template),
        $footer = $modal.find('.modal-footer'),
        headerClass, buttonClass,

        createButton = function (content, onClick){
            var $button = $(options.buttonTemplate);
            $button.text(content);
            if (onClick && $.isFunction(onClick))
                $button.click(function(){
                    onClick(this, $modal)
                });
            else
                $button.attr('data-dismiss', 'modal');
            return $button;
        };

    if (!$.isPlainObject(options.buttons) || $.isEmptyObject(options.buttons))
        $footer.append(createButton(options.buttonOK));
    else
        for (var index in options.buttons)
            $footer.append(createButton(index, options.buttons[index]));

    switch (options.type) {
        case DIALOG_QUESTION:
            headerClass = 'modal-header-info';
            buttonClass = 'btn-info';
            break;
        case DIALOG_SUCCESS:
            headerClass = 'modal-header-success';
            buttonClass = 'btn-success';
            break;
        case DIALOG_WARNING:
            headerClass = 'modal-header-warning';
            buttonClass = 'btn-warning';
            break;
        case DIALOG_EXCLAMATION:
            headerClass = 'modal-header-danger';
            buttonClass = 'btn-danger';
            break;
        case DIALOG_INVERT:
            headerClass = 'modal-header-invert';
            buttonClass = 'btn-default';
            break;
        default:
            buttonClass = 'btn-primary';
            break;
    }

    if (headerClass) 
        $modal.find('.modal-header').addClass(headerClass);
    
    $footer.find('button:first').removeClass('btn-default').addClass(buttonClass);
    $footer.attr('style', 'text-align: ' + options.buttonAlign + ';');

    $modal.find('.modal-dialog').innerWidth(options.width);
    $modal.find('.modal-title').html(options.title);
    $modal.find('.modal-body').html(content);

    $modal.on('hidden.bs.modal', function(){
        if (options.onClose)
            options.onClose();
        $modal.remove();
    });

    $('body').append($modal);

    $modal.modal('show');
};

DialogBox.DEFAULTS = {
    template: '<div class="modal modal-xdialog fade" id="modal-xdialog" tabindex="-1" role="dialog" aria-labelledby="modal-dialog-label" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" id="btnClose" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="modal-dialog-label"></h4></div><div class="modal-body"></div><div class="modal-footer"></div></div></div></div>',
    width: 500,
    title: 'Information',
    type: DIALOG_INFORMATION,
    buttonTemplate: '<button type="button" class="btn btn-default" data-dismiss="modal"></button>',
    buttonOK: 'OK',
    buttonAlign: 'center',
    onClose: null
};

/**
 * @example
 * MessageBox('Buy?', {
 *    type: DIALOG_QUESTION,                         //Default DIALOG_INFORMATION
 *    title: 'Question',                             //Default 'Information'
 *    icon: 'glyphicon-shopping-cart',               //Default 'glyphicon-info-sign'
 *    buttons: {'Yes': function(){...}, 'No': null}, //Default OK button
 *    onClose: function(){...}                       //Default null
 * })
 *
 */
var MessageBox = function (message, options) {
    options  = $.extend({}, MessageBox.DEFAULTS, options);

    var $content = $(options.iconTemplate),
        iconClass;

    if (options.icon && typeof options.icon !== 'string')
        options.icon = null;

    switch (options.type) {
        case DIALOG_QUESTION:
            iconClass = 'text-info ' + (options.icon || 'glyphicon-question-sign');
            break;
        case DIALOG_SUCCESS:
            iconClass = 'text-success ' + (options.icon || 'glyphicon-info-sign');
            break;
        case DIALOG_WARNING:
            iconClass = 'text-warning ' + (options.icon || 'glyphicon-warning-sign');
            break;
        case DIALOG_EXCLAMATION:
            iconClass = 'text-danger ' + (options.icon || 'glyphicon-exclamation-sign');
            break;
        case DIALOG_INVERT:
            iconClass = 'text-muted ' + (options.icon || 'glyphicon-info-sign');
            break;
        default:
            iconClass = 'text-primary ' + (options.icon || options.iconClass);
            break;
    }

    $content.find('#col-icon').html('<i class="glyphicon ' + iconClass + '" style="font-size: ' + options.iconSize + 'px"></i> ');
    $content.find('#col-text').html(message);

    DialogBox($content, options);
};

MessageBox.DEFAULTS = {
    iconTemplate: '<table><tr><td id="col-icon" valign="top"></td><td id="col-text"></td></tr></table>',
    iconClass: 'glyphicon-info-sign',
    iconSize: 32
};

/**
 * @example
 * FormBox('/login', {
 *    type: DIALOG_INFO,                                  //Default DIALOG_PRIMARY
 *    title: 'Login',                                     //Default 'Form'
 *    buttons: {'Save': function(){...}, 'Cancel': null}, //Default 'Close' and 'Save changes' buttons with ajaxSubmit (jquery.form.min.js is required)
 *    onSaveCallback: function(){...}                     //Only when the 'buttons' option is empty
 * })
 *
 */
var FormBox = function (url, options) {
    options = $.extend({}, FormBox.DEFAULTS, options);

    if (!$.isPlainObject(options.buttons))
        options.buttons = {
            'Save changes': function(sender, $modal) {
                var $form = $modal.find('form');

                if ($.isFunction($form.ajaxSubmit)) {
                    $form.ajaxSubmit({
                        success: function (response) {
                            switch (response.status) {
                                case 200:
                                    if (options.onSaveCallback && $.isFunction(options.onSaveCallback))
                                        options.onSaveCallback($modal, response.content);
                                    else
                                        $modal.find('.modal-body').html(response.content);
                                    break;
                                case 301:
                                case 302:
                                    $modal.on('hidden.bs.modal', function(){
                                        window.location.href = response.content;
                                    });
                                    $modal.modal('hide');
                                    break;
                                default:
                                    MessageBox(response.content, {
                                        type: DIALOG_EXCLAMATION,
                                        title: response.status + ' ' + response.statusText
                                    });
                                    break;
                            }
                        }
                    });
                } else {
                    MessageBox('FormBox requires jquery.form.min.js', {
                        type: DIALOG_EXCLAMATION,
                        title: 'ajaxSubmit not found!'
                    });
                }
            },
            'Close': null
        };

    ajaxGet(url, {
        onSuccess: function(content) {
            DialogBox(content, options)
        }
    });
};

FormBox.DEFAULTS = {
    title: 'Form',
    width: 600,
    buttonTemplate: '<button type="button" class="btn btn-default"></button>',
    buttonAlign: 'right',
    onSaveCallback: null
};