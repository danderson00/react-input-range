import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';

/**
 * @ignore
 */
export default class Track extends React.Component {
  /**
   * @override
   * @return {Object}
   * @property {Function} children
   * @property {Function} classNames
   * @property {Function} onTrackMouseDown
   * @property {Function} onTrackDrag
   * @property {Function} percentages
   */
  static get propTypes() {
    return {
      children: PropTypes.node.isRequired,
      classNames: PropTypes.objectOf(PropTypes.string).isRequired,
      onTrackMouseDown: PropTypes.func.isRequired,
      onTrackMouseUp: PropTypes.func,
      onTrackDrag: PropTypes.func,
      percentages: PropTypes.objectOf(PropTypes.number).isRequired,
    };
  }

  /**
   * @param {Object} props
   * @param {InputRangeClassNames} props.classNames
   * @param {Function} props.onTrackMouseDown
   * @param {Function} props.onTrackDrag
   * @param {number} props.percentages
   */
  constructor(props) {
    super(props);

    /**
     * @private
     * @type {?Component}
     */
    this.node = null;
  }

  /**
   * @private
   * @return {ClientRect}
   */
  getClientRect() {
    return this.node.getBoundingClientRect();
  }

  /**
   * @private
   * @return {Object} CSS styles
   */
  getActiveTrackStyle() {
    const width = `${(this.props.percentages.max - this.props.percentages.min) * 100}%`;
    const left = `${this.props.percentages.min * 100}%`;

    return { left, width };
  }

  /**
   * @private
   * @return {Object} Position
   */
  getPositionFromEvent(event) {
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const trackClientRect = this.getClientRect();
    return {
      x: clientX - trackClientRect.left,
      y: 0,
    };
  }

  /**
   * Listen to mousemove event
   * @private
   * @return {void}
   */
  addDocumentMouseMoveListener() {
    this.removeDocumentMouseMoveListener();
    this.node.ownerDocument.addEventListener('mousemove', this.handleMouseMove);
  }

  /**
   * Listen to mouseup event
   * @private
   * @return {void}
   */
  addDocumentMouseUpListener() {
    this.removeDocumentMouseUpListener();
    this.node.ownerDocument.addEventListener('mouseup', this.handleMouseUp);
  }

  /**
   * Listen to touchmove event
   * @private
   * @return {void}
   */
  addDocumentTouchMoveListener() {
    this.removeDocumentTouchMoveListener();
    this.node.ownerDocument.addEventListener('touchmove', this.handleTouchMove);
  }

  /**
   * Listen to touchend event
   * @private
   * @return {void}
   */
  addDocumentTouchEndListener() {
    this.removeDocumentTouchEndListener();
    this.node.ownerDocument.addEventListener('touchend', this.handleTouchEnd);
  }

  /**
   * @private
   * @return {void}
   */
  removeDocumentMouseMoveListener() {
    this.node.ownerDocument.removeEventListener('mousemove', this.handleMouseMove);
  }

  /**
   * @private
   * @return {void}
   */
  removeDocumentMouseUpListener() {
    this.node.ownerDocument.removeEventListener('mouseup', this.handleMouseUp);
  }

  /**
   * @private
   * @return {void}
   */
  removeDocumentTouchMoveListener() {
    this.node.ownerDocument.removeEventListener('touchmove', this.handleTouchMove);
  }

  /**
   * @private
   * @return {void}
   */
  removeDocumentTouchEndListener() {
    this.node.ownerDocument.removeEventListener('touchend', this.handleTouchEnd);
  }

  /**
   * @private
   * @return {void}
   */
  @autobind
  handleMouseDown(event) {
    this.props.onTrackMouseDown(event, this.getPositionFromEvent(event));
    this.addDocumentMouseMoveListener();
    this.addDocumentMouseUpListener();
  }

  /**
   * @private
   * @return {void}
   */
  @autobind
  handleMouseUp() {
    this.props.onTrackMouseUp(event, this.getPositionFromEvent(event));
    this.removeDocumentMouseMoveListener();
    this.removeDocumentMouseUpListener();
  }

  /**
   * @private
   * @param {SyntheticEvent} event
   * @return {void}
   */
  @autobind
  handleMouseMove(event) {
    this.props.onTrackDrag(event, this.getPositionFromEvent(event));
  }

  /**
   * @private
   * @param {SyntheticEvent} event
   * @return {void}
   */
  @autobind
  handleTouchStart(event) {
    event.preventDefault();
    this.handleMouseDown(event);
  }

  /**
   * @private
   * @return {void}
   */
  @autobind
  handleTouchEnd() {
    event.preventDefault();
    this.handleMouseUp();
  }

  /**
   * @private
   * @param {SyntheticEvent} event
   * @return {void}
   */
  @autobind
  handleTouchMove(event) {
    event.preventDefault();
    this.handleMouseMove(event);
  }

  /**
   * @override
   * @return {JSX.Element}
   */
  render() {
    const activeTrackStyle = this.getActiveTrackStyle();

    return (
      <div
        className={this.props.classNames.track}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        ref={(node) => { this.node = node; }}>
        <div
          style={activeTrackStyle}
          className={this.props.classNames.activeTrack} />
        {this.props.children}
      </div>
    );
  }
}
