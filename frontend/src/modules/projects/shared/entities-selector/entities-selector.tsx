import * as React from 'react';
import 'antd/dist/antd.css';
import './entities-selector.scss';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Input, Icon, Button, message, Modal } from 'antd';
import { Entity } from '../../../../models/entity';

export class EntitiesSelectorComponent extends React.Component<any> {

  // Define the props in component
  public props: any;

  // Define state
  public state: any = {
    tag: null,
    name: null,
    description: null,
    date: null
  };
  // clasifications
  public entities: Entity[] = [];

  public componentDidMount(): void {
    this.entities = this.props.entities;
    this.setState({
      date: new Date()
    });
  }

  public setPropertie(event: any): void {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  public addEntity(): any {
    if (!this.state.tag || !this.state.name || !this.state.description) {
      return message.warning('Debe ingresaer todos los campos');
    }

    this.entities.push(new Entity({
      name: this.state.name,
      tag: this.state.tag,
      description: this.state.description
    }));
    // Clean
    this.setState({
      tag: '',
      name: '',
      description: ''
    });
    // Set clasification
    this.props.setEntities(this.entities);
  }

  public deleteTag(tag: Entity): void {
    this.entities.splice(this.entities.indexOf(tag), 1);
    this.setState({
      date: new Date()
    });
  }

  public showLabels(): any {
    if (this.entities.length > 0) {
      return (
        <div className="labels">
          <div className="description_label">Entidades: </div>
          <div className="tags">
            {
              this.entities.map((entity, index) => {
                return  <div className="tag" key={index}>
                    <div className="title">{entity.name}</div> 
                    <div className="close">
                      <Icon type="close" onClick={this.deleteTag.bind(this, entity)}></Icon>
                    </div>
                  </div>
              })
            }
          </div>    
        </div>
      )
    }
  }

  public render() {
    if (this.props.disabled) {
      return (
        <div className="entity">
          <div className="inline">
            <Input prefix={<Icon type="edit" />}
              placeholder="Tag"
              name="tag"
              defaultValue={this.state.tag}
              value={this.state.tag}
              type="text"
              className="space"
              onChange={this.setPropertie.bind(this)}></Input>
            <Input prefix={<Icon type="edit" />}
              placeholder="Nombre a visualizar"
              name="name"
              defaultValue={this.state.name}
              value={this.state.name}
              type="text"
              className="space"
              onChange={this.setPropertie.bind(this)}></Input>
          </div>
          <div className="inline description">
            <Input prefix={<Icon type="edit" />}
              placeholder="Descripcion"
              name="description"
              defaultValue={this.state.description}
              value={this.state.description}
              type="text"
              className="space"
              onChange={this.setPropertie.bind(this)}></Input>
            <Button type="primary" onClick={this.addEntity.bind(this)}>Agregar</Button>
          </div>
          {this.showLabels()}
        </div>
      )
    }
  }
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

export default connect(mapStateToProps, matchDispatchToProps)(withRouter(EntitiesSelectorComponent));