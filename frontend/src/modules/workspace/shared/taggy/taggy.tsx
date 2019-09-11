import * as React from 'react';
import './taggy.scss';
import 'antd/dist/antd.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Tag, Icon } from 'antd';
import { DatasetItemTag } from '../../../../models/dataset-item-tag';

export class Taggy extends React.Component<any> {

  // Define the props in component
  public props: any;
  public state: any = {
    date: null
  };

  public objects: TagItem[] = [];

  public analizeTags(): any {
    this.objects = [{
      text: this.props.text,
      start: 0,
      end: (this.props.text) ? this.props.text.length - 1 : 0,
      tag: false,
      color: '',
      type: ''
    }];

    this.props.spans.map((tag:DatasetItemTag) => {
      let type = this.props.ents.find((ent: any) => {
        return ent.type === tag.type;
      });

      let text = this.objects.find((ent:TagItem) => {
        return tag.start >= ent.start && tag.end <= ent.end
      });

      if (text) {
        this.analizeTag(text, tag, type);
      }

      return true;
    });
  }

  public analizeTag(item: TagItem, tag: DatasetItemTag, type: any): void {
    this.objects.splice(this.objects.indexOf(item), 1);

    // Add the tag
    this.objects.push({
      text: item.text.slice(tag.start - item.start, tag.end - item.start),
      start: tag.start + 1,
      end: tag.end,
      tag: true,
      color: (type) ? type.color : '#FFFFF',
      type: (type) ? type.type : ''
    });

    this.objects.push({
      text: item.text.substring(0, (tag.start - item.start)),
      start: item.start,
      end: tag.start,
      tag: false,
      color: '',
      type: ''
    });

    this.objects.push({
      text: item.text.substring(tag.end - item.start, (item.text.length - 1)),
      start: tag.end + 1,
      end: (item.end === this.props.text.length - 1) ? item.end: item.text.length - 1,
      tag: false,
      color: '',
      type: ''
    });

    this.objects.sort((a:TagItem, b:TagItem) => {
      return a.start - b.start;
    });
  }

  public deleteTag(tag: TagItem): void {
    this.props.delete(tag);
  }

  public draw(): any {
    this.analizeTags();
    return this.objects.map((tag: TagItem, index: number) => {
      if (tag.tag) {
        return (
          <Tag color={tag.color} key={index} className="tag">
            {tag.text + '  '}
            <b>{'(' + tag.type + ')'}</b>
            <Icon type="close" onClick={this.deleteTag.bind(this, tag)}></Icon>
          </Tag>
        )
      } else {
        return (
          tag.text
        )
      }
    });
  }

  public render() {
    return (
      <div>
        {this.draw()}
      </div>
    )
  }
}

interface TagItem {
  text: string;
  start: number;
  end: number;
  tag: boolean;
  color: string;
  type: string | null;
}

// Configure React-redux store functions
function mapStateToProps(state: any) {
  return {
  }
}

function matchDispatchToProps(dispatch: any) {
  return bindActionCreators({
  }, dispatch);
}
  
export default connect(mapStateToProps, matchDispatchToProps)(withRouter(Taggy));