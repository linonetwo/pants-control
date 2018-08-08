// @flow
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import styled from 'styled-components';
import Segmentit, { useDefault, cnPOSTag } from 'segmentit';
import { Tooltip } from 'antd';

const segmentit = useDefault(new Segmentit());

const Highlight = styled.mark``;

type Props = {
  children: string | Object,
  node: Object,
  value: Object,
  onChange: Function,
};
type State = {
  text: string,
  tags: Object[],
};
export default class Parse extends Component<Props, State> {
  state = {
    text: '',
    tags: [],
    /** 是否已经把 tag 同步到 slate 的 node 里 */
    nodeUpdated: true,
  };

  static getDerivedStateFromProps(nextProps: Props, state: State) {
    const { text } = nextProps?.node;
    if (text && nextProps.node.text !== state.text) {
      const tags = segmentit.doSegment(text);
      return {
        text,
        tags,
        nodeUpdated: false,
      };
    }
    return null;
  }

  componentDidUpdate() {
    const { nodeUpdated, tags } = this.state;
    if (!nodeUpdated) {
      const { node, value, onChange } = this.props;
      if (node.key) {
        this.setState({ nodeUpdated: true }, () => onChange(value.change().setNodeByKey(node.key, { data: { tags } })));
      }
    }
  }

  render() {
    const { children } = this.props;
    const { tags } = this.state;
    return (
      <Tooltip title={tags.map(({ w, p }) => `${w} <${cnPOSTag(p)}>`)}>
        <Highlight>{children}</Highlight>
      </Tooltip>
    );
  }
}
