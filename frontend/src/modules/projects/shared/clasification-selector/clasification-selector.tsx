import * as React from 'react';
import 'antd/dist/antd.css';
import './clasification-selector.scss';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Input, Icon, Button, message, Modal } from 'antd';
import { Clasification } from '../../../../models/clasification';
import { Subclasification } from '../../../../models/subclasification';

export class ClasificatorSelectorComponent extends React.Component<any> {

  // Define the props in component
  public props: any;

  // Define state
  public state: any = {
    tag: null,
    name: null,
    description: null,
    subtag: null,
    subname: null,
    subdescription: null,
    date: null
  };
  // clasifications
  public clasifications: Clasification[] = [];
  public clasification: any;

  public componentDidMount(): void {
    this.clasifications = this.props.clasifications;
    this.setState({
      date: new Date()
    });
  }

  public setPropertie(event: any): void {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  public addClasification(): any {
    if (!this.state.tag || !this.state.name || !this.state.description) {
      return message.warning('Debe ingresaer todos los campos');
    }

    this.clasifications.push(new Clasification({
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
    this.props.setClasifications(this.clasifications);
  }

  public addSubclasification(): any {
    if (!this.state.subtag || !this.state.subname || !this.state.subdescription) {
      return message.warning('Debe ingresaer todos los campos');
    }

    this.clasification.subclasifications.push(new Subclasification({
      name: this.state.subname,
      tag: this.state.subtag,
      description: this.state.subdescription
    }));
    // Clean
    this.setState({
      subtag: '',
      subname: '',
      subdescription: ''
    });
    // Set clasification
    this.props.setClasifications(this.clasifications);
  }

  public deleteTag(tag: Clasification): void {
    this.clasifications.splice(this.clasifications.indexOf(tag), 1);
    this.setState({
      date: new Date()
    });
  }

  public deleteSubtag(subtag: Subclasification): void {
    this.clasification.subclasifications
    .splice(this.clasification.subclasifications.indexOf(subtag), 1);
    this.setState({
      date: new Date()
    });
  }

  public handleOk(): void {

  }

  public setClasification(clasification: Clasification |  null): any {
    this.clasification = clasification;
    this.setState({
      date: new Date()
    });
  }

  public subcategory(): any {
    if (this.clasification) {
      return (
        <Modal
          title={`Subcategorias de ${this.clasification.name}`}
          visible={this.clasification}
          onOk={this.setClasification.bind(this, null)}
          onCancel={this.setClasification.bind(this, null)}
          bodyStyle={{
            "display": "flex",
            "flexDirection": "row"
          }}
        >
          <div className="subclasification">
            <div className="inline">
              <Input prefix={<Icon type="edit" />}
                placeholder="Tag"
                name="subtag"
                defaultValue={this.state.subtag}
                value={this.state.subtag}
                type="text"
                className="space"
                onChange={this.setPropertie.bind(this)}></Input>
              <Input prefix={<Icon type="edit" />}
                placeholder="Nombre a visualizar"
                name="subname"
                defaultValue={this.state.subname}
                value={this.state.subname}
                type="text"
                onChange={this.setPropertie.bind(this)}></Input>
            </div>
            <div className="inline description">
              <Input prefix={<Icon type="edit" />}
                placeholder="Descripcion"
                name="subdescription"
                defaultValue={this.state.subdescription}
                value={this.state.subdescription}
                type="text"
                className="space"
                onChange={this.setPropertie.bind(this)}></Input>
              <Button type="primary" onClick={this.addSubclasification.bind(this)}>Agregar</Button>
            </div>
            {this.showSubLabels()}
          </div>
        </Modal>
      );
    }
  }

  public showLabels(): any {
    if (this.clasifications.length > 0) {
      return (
        <div className="labels">
          <div className="description_label">Clasificaciones: </div>
          <div className="tags">
            {
              this.clasifications.map((clasification, index) => {
                return  <div className="tag" key={index}>
                    <div className="title" onClick={this.setClasification.bind(this, clasification)}>{clasification.name}</div> 
                    <div className="close">
                      <Icon type="close" onClick={this.deleteTag.bind(this, clasification)}></Icon>
                    </div>
                  </div>
              })
            }
          </div>    
        </div>
      )
    }
  }

  public showSubLabels(): any {
    if (this.clasification.subclasifications && this.clasification.subclasifications.length > 0) {
      return (
        <div className="labels">
          <div className="description_label">Subclasificaciones: </div>
          <div className="tags">
            {
              this.clasification.subclasifications
              .map((subclasification: any, index: number) => {
                return  <div className="tag" key={index}>
                    <div className="title">{subclasification.name}</div> 
                    <div className="close">
                      <Icon type="close" onClick={this.deleteSubtag.bind(this, subclasification)}></Icon>
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
        <div className="clasification">
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
            <Button type="primary" onClick={this.addClasification.bind(this)}>Agregar</Button>
          </div>
          {this.showLabels()}
          {this.subcategory()}
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

export default connect(mapStateToProps, matchDispatchToProps)(withRouter(ClasificatorSelectorComponent));