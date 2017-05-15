define(['text!../../tpl/_modal_template.html', 'text!../../tpl/_modal.html', 'laytpl'], function(_modal_template, _modal, laytpl) {
    function Modal(option) {
        var bodyHtml = $(_modal_template).find(option.selector).html();

        var modalNode = $(_modal);

        modalNode.find('.modal-body').html(bodyHtml);

        var data = {
            title: "",
            content: ""
        };
        var data = option.data;
        console.log(data);
        var modalHtml = laytpl(modalNode.html()).render(data);

        $("#modal").html(modalHtml).modal('show');
    }

    return Modal;
});
