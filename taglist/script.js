'use strict';

(function() {
    function TagList(node, list) {
        this.node = node;
        this.list = list;
        this.node.append(
            '<div class="tag-list">' +
            '<div class="edit">' +
            '<span>Edit tags</span> ' +
            '<span>Remove all tags</span>' +
            '</div>' +
            '<div class="tags"></div>' +
            '<div class="add-tag">' +
            '<input type="text">' +
            '<input type="submit" value="Add">' +
            '</div>' +
            '</div>'
        );
        this.init();
    }

    TagList.prototype.init = function() {
        var currentTagList = this.node.find('.tag-list').last();
        this.tagsContainer = currentTagList.find('.tags').last();
        this.showGivenTags(this.tagsContainer);
        var editBtn = currentTagList.find('.edit > span').eq(0);
        this.removeAllBtn = currentTagList.find('.edit > span').eq(1);
        var addTagBtn = currentTagList.find('[type=submit]');
        var tagInputField = currentTagList.find('[type=text]');
        var ENTER = 13;
        var _this = this;
        editBtn.click(function() {
            if ($(this).text() === 'Edit tags') {
                _this.startEditMode(currentTagList);
                _this.removeAllBtnBehaviour();
                $(this).text('Finish editing');
            } else {
                $(this).text('Edit tags');
                currentTagList.find('.add-tag, .cross').fadeOut(200);
                _this.removeAllBtn.hide();
            }
            
        });
        this.removeAllBtn.click(function() {
            if (!confirm('All the tags will be completely removed. Are you sure?')) return;
            _this.tagsContainer.find('span').fadeOut(200, function() {
                $(this).remove();
                _this.removeAllBtnBehaviour();
            });
            
        });
        addTagBtn.click(function() {
            _this.addTag(currentTagList);
        });
        tagInputField.keydown(function(e) {
            if (e.keyCode === ENTER) {
                _this.addTag(currentTagList);
            }
        });
    };

    TagList.prototype.removeAllBtnBehaviour = function() {
        this.tagsContainer.children().length > 1 ? this.removeAllBtn.show() : this.removeAllBtn.hide();
    };

    TagList.prototype.showGivenTags = function(container) {
        if (this.list) {
            this.list.filter(function(tag, i, arr) {
                return arr.indexOf(tag) === i;
            }).forEach(function(tag) {
                container.append('<span></span> ').find('span').last()
                    .text(tag).append('<span class="cross">' + '\u274c' + '</span>');
            });
        }
    };

    TagList.prototype.startEditMode = function(tagList) {
        tagList.find('.add-tag').slideDown(200);
        tagList.find('.cross').fadeIn(100);
        var _this = this;
        tagList.find('.cross').click(function() {
            $(this).parent().fadeOut(200, function() {
                $(this).remove();
                _this.removeAllBtnBehaviour();
            });
        });
    };

    TagList.prototype.addTag = function(tagList) {
        var textInputField = tagList.find('[type=text]');
        var tagValue = textInputField.val().trim();
        var tags = this.tagsContainer.find('span');
        var arrOfTags = [];
        tags.each(function(i, span) {
            if (i % 2 === 0) {
                arrOfTags.push($(span).contents()[0].textContent);
            }
        });
        if (tagValue && $.inArray(tagValue, arrOfTags) === -1) {
            this.tagsContainer.append('<span></span> ').find('span').last()
                .text(tagValue).append('<span class="cross">&#10060;</span>');
            textInputField.val('');
        }
        this.startEditMode(tagList);
        this.removeAllBtnBehaviour();
    };

    window.TagList = TagList;
})();