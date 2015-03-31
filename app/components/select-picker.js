import Ember from 'ember';
import SelectPickerMixin from 'ember-cli-select-picker/mixins/select-picker';
import KeyboardShortcutsMixin from 'ember-cli-select-picker/mixins/keyboard-shortcuts';

var I18nProps = (Ember.I18n && Ember.I18n.TranslateableProperties) || {};

var SelectPickerComponent = Ember.Component.extend(
  SelectPickerMixin, KeyboardShortcutsMixin, I18nProps, {

  selectAllLabel:  'All',
  selectNoneLabel: 'None',

  classNames: ['select-picker'],

  activeCursor: 0,

  activeIndex: function() {
    var cursor = this.get('activeCursor');
    var len = this.get('contentList.length');
    return (cursor % len + len) % len;
  }.property('activeCursor', 'contentList.length'),

  activeItem: function() {
    return this.get('contentList').objectAt(this.get('activeIndex'));
  }.property('activeIndex', 'contentList.[]'),

  keyboardShortcuts: {
    'enter': function() {
      this.send('selectItem', this.get('activeItem'));
      return false;
    },
    'up': 'activePrev',
    'down': 'activeNext',
    'shift+tab': 'activePrev',
    'tab': 'activeNext',
    'esc': 'closeDropdown'
  },

  didInsertElement: function() {
    var eventName = 'click.' + this.get('elementId');
    var _this = this;
    $(document).on(eventName, function (e) {
      if (_this.get('keepDropdownOpen')) {
        _this.set('keepDropdownOpen', false);
        return;
      }
      if (_this.element && !$.contains(_this.element, e.target)) {
        _this.set('showDropdown', false);
      }
    });
  },

  willDestroyElement: function() {
    $(document).off('.' + this.get('elementId'));
  },

  groupedContentList: function() {
    var lastGroup;
    return this.get('contentList').map(function(item) {
      var clonedItem = Ember.copy(item);
      if (clonedItem.group === lastGroup) {
        clonedItem.group = null;
      } else {
        lastGroup = clonedItem.group;
      }
      return clonedItem;
    });
  }.property('contentList.@each'),

  actions: {
    showHide: function () {
      this.toggleProperty('showDropdown');
      if (this.get('showDropdown')) {
        this.trigger('enableShortcuts');
      } else {
        this.trigger('disableShortcuts');
      }
    },
    activeNext: function() {
      this.incrementProperty('activeCursor');
    },
    activePrev: function() {
      this.decrementProperty('activeCursor');
    },
    closeDropdown: function() {
      this.set('showDropdown', false);
    }
  }
});

export default SelectPickerComponent;
