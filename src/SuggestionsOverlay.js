import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defaultStyle } from 'substyle';
import addResizeListener from 'add-resize-listener';

import utils from './utils';

import Suggestion from './Suggestion';
import LoadingIndicator from './LoadingIndicator';

class SuggestionsOverlay extends Component {

  static propTypes = {
    suggestions: PropTypes.object.isRequired,
    focusIndex: PropTypes.number,
    scrollFocusedIntoView: PropTypes.bool,
    isLoading: PropTypes.bool,
    onSelect: PropTypes.func,
    onResize: PropTypes.func,
    listRef: PropTypes.func,
  };

  static defaultProps = {
    suggestions: {},
    onSelect: () => null,
    onResize: () => null,
  };

  componentDidMount() {
    const { suggestionsRef: suggestions } = this;
    if (suggestions) {
      const bounds = suggestions.getBoundingClientRect();
      if (bounds.bottom - bounds.top > 5) {
        this.props.onResize();
      }

      this.removeResize = addResizeListener(suggestions, () => {
        this.props.onResize();
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { suggestionsRef: suggestions } = this;
    if (suggestions && !this.removeResize) {
      this.removeResize = addResizeListener(suggestions, () => {
        this.props.onResize();
      });
    }
    if (!suggestions || suggestions.offsetHeight >= suggestions.scrollHeight || !this.props.scrollFocusedIntoView) {
      return
    }

    const scrollTop = suggestions.scrollTop
    let { top, bottom } = suggestions.children[this.props.focusIndex].getBoundingClientRect();
    const { top: topContainer } = suggestions.getBoundingClientRect();
    top = (top - topContainer) + scrollTop;
    bottom = (bottom - topContainer) + scrollTop;

    if(top < scrollTop) {
      suggestions.scrollTop = top
    } else if(bottom > suggestions.offsetHeight) {
      suggestions.scrollTop = bottom - suggestions.offsetHeight
    }
    if (!prevProps.suggestions ||
      !this.props.suggestions ||
      this.props.suggestions.length !== prevProps.suggestions.length
    ) {
      this.props.onResize();
    }
  }

  componentWillUnmount() {
    if (this.removeResize) {
      this.removeResize();
    }
  }

  render() {
    const { suggestions, isLoading, style, onMouseDown } = this.props;

    // do not show suggestions until there is some data
    if(utils.countSuggestions(suggestions) === 0 && !isLoading) {
      return null;
    }

    return (
      <div
        {...style}
        onMouseDown={onMouseDown}
      >

        <ul
          ref={(el) => {
            this.suggestionsRef = el;
            if (this.props.listRef) {
              this.props.listRef(el);
            }
          }}
          { ...style("list") }
        >
          { this.renderSuggestions() }
        </ul>

        { this.renderLoadingIndicator() }
      </div>
    );
  }

  renderSuggestions() {
    return utils.getSuggestions(this.props.suggestions).reduce((result, { suggestions, descriptor }) => [
      ...result,

      ...suggestions.map((suggestion, index) => this.renderSuggestion(
        suggestion,
        descriptor,
        result.length + index
      ))
    ], []);
  }

  renderSuggestion(suggestion, descriptor, index) {
    let id = this.getID(suggestion);
    let isFocused = (index === this.props.focusIndex);

    let { mentionDescriptor, query } = descriptor;

    return (
      <Suggestion
        style={this.props.style("item")}
        key={ id }
        id={ id }
        ref={isFocused ? "focused" : null}
        query={ query }
        index={ index }
        descriptor={ mentionDescriptor }
        suggestion={ suggestion }
        focused={ isFocused }
        onClick={ () => this.select(suggestion, descriptor) }
        onMouseEnter={ () => this.handleMouseEnter(index) } />
    );
  }

  getID(suggestion) {
    if(suggestion instanceof String) {
      return suggestion;
    }

    return suggestion.id;
  }

  renderLoadingIndicator () {
    if(!this.props.isLoading) {
      return;
    }

    return <LoadingIndicator { ...this.props.style("loadingIndicator") } />
  }

  handleMouseEnter(index, ev) {
    if(this.props.onMouseEnter) {
      this.props.onMouseEnter(index);
    }
  }

  select(suggestion, descriptor) {
    this.props.onSelect(suggestion, descriptor);
  }

}

const styled = defaultStyle(({ position }) => ({
  position: "absolute",
  zIndex: 1,
  backgroundColor: "white",
  marginTop: 14,
  minWidth: 100,
  ...position,

  list: {
    margin: 0,
    padding: 0,
    listStyleType: "none",
  }
}));

export default styled(SuggestionsOverlay);
