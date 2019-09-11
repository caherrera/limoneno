import * as React from 'react';
import './draft.scss';
import 'antd/dist/antd.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Icon, Button, Steps, Form, Input, Select, message, Checkbox } from 'antd';
import { setProject, destroyProject, getProject, editProject } from '../../../../actions/doprojects';
import { getUsers } from '../../../../actions/dousers'
import { getDatasets } from '../../../../actions/dodatasets';
import { Project } from '../../../../models/project';
import { Dataset } from '../../../../models/dataset';
import { Entity } from '../../../../models/entity';
import { User } from '../../../../models/user';
import ProjectService from '../../../../services/projects/projects.service';
import ClasificatorSelectorComponent from '../../shared/clasification-selector/clasification-selector';
import EntitiesSelectorComponent from '../../shared/entities-selector/entities-selector';
import { Clasification } from '../../../../models/clasification';

export class DraftProjectComponent extends React.Component<any> {

  // Define the props in component
  public props: any;
  // Define states in component
  public state: any = {
    current: 0,
    project: new Project(),
    dataset: null,
    user: null,
    clasification: true,
    entities: true,
    loading: false
  };

  public componentDidMount() {
    this.props.getDatasets();
    this.props.getUsers();
    if (this.props.match.params.id) {
      this.props.getProject(this.props.match.params.id);
    } else {
      this.setState({
        project: new Project({
          clasification_type: 3
        })
      });
    }
  }

  public getProject(id: number): void {
    ProjectService.getInstance().getProject(id).subscribe(data => {
      this.setState({
        project: data
      });
    });
  }

  public editProject(): void {
    this.setState({
      loading: true
    });
    ProjectService.getInstance().update(this.state.project).subscribe(data => {
      this.props.history.push('/projects');
    }, error => {
      message.error("Existio un error al actualizar el proyecto");
    });
  }

  public next(step: number, next: boolean): void {
    if (step === -1) {
      this.setState({
        current: next ? ++this.state.current: --this.state.current
      });
    } else {
      this.setState({
        current: step
      });
    }
  }

  public cancel(): void {
    this.props.history.push('/projects')
  }

  public validate(): boolean {
    if (!this.state.project.name) {
      message.warning('Debe ingresar el nombre del proyecto.');
      return false;
    }

    if (this.state.project.datasets.length === 0) {
      message.warning('Debe utilizar al menos 1 dataset.');
      return false;;
    }

    if (this.state.clasification && this.state.project.clasifications === 0) {
      message.warning('Debe ingresar al menos una clasificación.');
      return false;;
    }

    if (this.state.entities && this.state.project.entities === 0) {
      message.warning('Debe ingresar al menos una entidad.');
      return false;;
    }

    if (this.state.project.users.length === 0) {
      message.warning('Debe asignar al menos un usuario al proyecto.');
      return false;
    }

    return true;
  }

  public create(): void {
    this.setState({
      loading: true
    });
    
    if (this.validate()) {
      ProjectService.getInstance().create(this.state.project).subscribe(data => {
        this.props.history.push("/projects")
      });
    } else {
      this.setState({
        loading: false
      });
    }
  }

  public actionButton(): any {
    if (this.props.project && this.props.project.id) {
      return (
        <Button type="primary" className="edit__button" loading={this.state.loading}
        onClick={this.editProject.bind(this)}>Editar Proyecto</Button>
      )
    } else {
      return (
        <Button type="primary" className="edit__button" loading={this.state.loading}
        onClick={this.create.bind(this)}>Crear Proyecto</Button>
      )
    }
  }

  public navigationButton(step: number): any {
    if (this.state.current > 0 && this.state.current < 3) {
      return (
        <div className="buttons">
          <Button type="danger" className="space__button"
          onClick={this.cancel.bind(this, {})}>Cancelar</Button>
          <Button className="space__button"
            onClick={this.next.bind(this, -1, false)}>Atras</Button>
          <Button type="primary" className="edit__button"
            onClick={this.next.bind(this, -1, true)}>Siguiente</Button>
        </div>
      );
    } else if (this.state.current === 3) {
      return (
        <div className="buttons">
          <Button type="danger" className="space__button"
          onClick={this.cancel.bind(this, {})}>Cancelar</Button>
          {this.actionButton()}
        </div>
      )
    } else {
      return (
        <div className="buttons">
          <Button type="danger" className="space__button"
          onClick={this.cancel.bind(this, {})}>Cancelar</Button>
          <Button type="primary" className="edit__button"
            onClick={this.next.bind(this, -1, true)}>Siguiente</Button>
        </div>
      );
    }
  }

  public showSteps(): any {
    return (
      <Steps size="small" current={this.state.current} className="step">
        <Steps.Step onClick={this.next.bind(this, 0, true)} className="action" 
          title="Información" description="Datos del proyecto" />
        <Steps.Step onClick={this.next.bind(this, 1, true)} className="action"
          title="Datasets" description="Datasets involucrados." />
        <Steps.Step onClick={this.next.bind(this, 2, true)} className="action"
          title="Entidades y tipos" description="Definición de entidades." />
        <Steps.Step onClick={this.next.bind(this, 3, true)} className="action"
          title="Usuarios" description="Usuarios involucrados." />
      </Steps>
    )
  }

  public setPropertie(propertie: string, event: any): void {
    let project = this.state.project;
    project[propertie] = event.target.value;
    this.setState({
      project: project
    });
  }

  public info(): any {
    return (
      <Form>
        <Form.Item className="inputs">
          <div className="label">Nombre proyecto:</div>
          <Input prefix={<Icon type="edit"/>}
          placeholder="Nombre"
          defaultValue={this.state.project.name}
          type="text"
          onChange={this.setPropertie.bind(this, 'name')}></Input>
        </Form.Item>
        <Form.Item className="inputs">
          <div className="label">Descripción:</div>
          <Input.TextArea rows={6}
          placeholder="Descripción del dataset"
          defaultValue={this.state.project.description}
          onChange={this.setPropertie.bind(this, 'description')}></Input.TextArea>
        </Form.Item>
        <Form.Item className="buttons">
          { this.navigationButton(0)}
        </Form.Item>
      </Form>
    )
  }

  public changeDataset(element: any, event: any): void {
    this.setState({
      dataset: this.props.datasets.find((dataset: Dataset) => {
        return dataset.id === element;
      })
    });
  }

  public removeDataset(dataset: Dataset): void {
    let project = this.state.project;
    project.datasets.splice(project.datasets.indexOf(dataset), 1);
    this.setState({
      project: project
    });
  }

  public addDataset(): void {
    if (this.state.project.datasets.indexOf(this.state.dataset) !== -1) {
      message.warning("El dataset ya fue agregado");
      return;
    }
    let project = this.state.project;
    project.datasets.push(this.state.dataset);
    this.setState({
      project: project
    });
  }

  public showDatasets(): any {
    return (
      <div className="datasets_list">
        <div className="datasets_item dark">
          <div className="datasets_name">Nombre</div>
          <div className="datasets_elements">Numero de elementos</div>
          <div className="datasets_delete"> Acciones </div>
        </div>
        { this.state.project.datasets.map((dataset: Dataset) => {
          return (
            <div className="datasets_item" key={dataset.id}>
              <div className="datasets_name">{dataset.name}</div>
              <div className="datasets_elements">{dataset.items_count} Elementos</div>
              <div className="datasets_delete" 
                onClick={this.removeDataset.bind(this, dataset)}
              >
                <Icon type="delete" /> Eliminar
              </div>
            </div>
          )
        })}
      </div>
    );
  }

  public datasets(): any {
    return (
      <Form>
        <Form.Item className="inputs">
          <div className="label">Seleccione un dataset:</div>
          <div className="inline">
            <Select className=""
              showSearch
              placeholder="Selecciona un dataset"
              optionFilterProp="children"
              onChange={this.changeDataset.bind(this)}
              filterOption={ (input: any, option: any) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {this.props.datasets.map((dataset: Dataset) => {
                return <Select.Option key={dataset.id} 
                  value={dataset.id}>{dataset.name + ' - ' + dataset.items_count + ' Elementos'}</Select.Option>
              })}
            </Select>
            <Button type="primary" onClick={this.addDataset.bind(this)}>Agregar</Button>
          </div>
        </Form.Item>
        <Form.Item className="inputs">
          <div className="label">Listado de Datasets:</div>
          {this.showDatasets()}
        </Form.Item>
        <Form.Item className="buttons">
          { this.navigationButton(1)}
        </Form.Item>
      </Form>
    )
  }

  public activateEntities(type: number): any {
    if (type === 1 && this.state.project.clasification_type !== 1) {
      this.state.project.clasification_type += (this.state.clasification) ? -1 : 1;
      this.setState({
        clasification: !this.state.clasification,
        project: this.state.project
      });
      return;
    }

    if (type === 2 && this.state.project.clasification_type !== 2) {
      this.state.project.clasification_type += (this.state.entities) ? -2 : 2;
      this.setState({
        entities: !this.state.entities,
        project: this.state.project
      });
      return;
    }

    message.warning("Debe mantener al menos una de los tipos de identificación");
  }

  public setClasifications(clasifications: Clasification[]): void {
    let project = this.state.project;
    project.clasifications = clasifications;
    this.setState({
      project: project
    });
  }

  public setEntities(entities: Entity[]): void {
    let project = this.state.project;
    project.entities = entities;
    this.setState({
      project: project
    });
  }

  public entities(): any {
    return (
      <Form>
        <Form.Item className="inputs">
          <div className="label">Clasificación de documentos:</div>
          <div className="checkbox">
            <Checkbox 
              onChange={this.activateEntities.bind(this, 1)}
              checked={this.state.clasification}
            />
            <span className="checkbox__label">
              ¿Desea activar la clasificación de documentos?
            </span>
          </div>
          <div className="label">Ingrese las clasificaciones:</div>
          <ClasificatorSelectorComponent
            disabled={this.state.clasification}
            setClasifications={this.setClasifications.bind(this)}
            clasifications={this.state.project.clasifications}
          ></ClasificatorSelectorComponent>
        </Form.Item>
        <Form.Item className="inputs">
          <div className="label">Busqueda de entidades:</div>
          <div className="checkbox">
            <Checkbox 
              onChange={this.activateEntities.bind(this, 2)}
              checked={this.state.entities}
            />
            <span className="checkbox__label">
              ¿Desea activar la busqueda de entidades?
            </span>
          </div>
          <div className="label">Ingrese las entidades:</div>
          <EntitiesSelectorComponent
            disabled={this.state.entities}
            setEntities={this.setEntities.bind(this)}
            entities={this.state.project.entities} 
          ></EntitiesSelectorComponent>
        </Form.Item>
        <Form.Item className="buttons">
          { this.navigationButton(2)}
        </Form.Item>
      </Form>
    )
  }

  public changeUser(element: any): void {
    this.setState({
      user: this.props.users.find((user: User) => {
        return user.id === element;
      })
    });
  }

  public addUser(): void {
    if (this.state.project.users.indexOf(this.state.user) !== -1) {
      message.warning("El usuario ya fue agregado");
      return;
    }
    let project = this.state.project;
    project.users.push(this.state.user);
    this.setState({
      project: project
    });
  }

  public showUsers(): any {
    return (
      <div className="users_list">
        <div className="users_item dark">
          <div className="users_name">Nombre</div>
          <div className="users_elements">Email</div>
          <div className="users_delete"> Acciones </div>
        </div>
        { this.state.project.users.map((user: User) => {
          return (
            <div className="users_item" key={user.id}>
              <div className="users_name">{user.name}</div>
              <div className="users_elements">{user.email}</div>
              <div className="users_delete" 
                onClick={this.removeUser.bind(this, user)}
              >
                <Icon type="delete" /> Eliminar
              </div>
            </div>
          )
        })}
      </div>
    );
  }

  public removeUser(user: User): void {
    let project = this.state.project;
    project.users.splice(project.users.indexOf(user), 1);
    this.setState({
      project: project
    });
  }

  public users(): any {
    return (
      <Form>
        <Form.Item className="inputs">
          <div className="label">Seleccione un usuario:</div>
          <div className="inline">
            <Select className=""
              showSearch
              placeholder="Selecciona un usuario"
              optionFilterProp="children"
              onChange={this.changeUser.bind(this)}
              filterOption={ (input: any, option: any) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {this.props.users.map((user: User) => {
                return <Select.Option key={user.id} 
                  value={user.id}>{user.name + ' - ' + user.email}</Select.Option>
              })}
            </Select>
            <Button type="primary" onClick={this.addUser.bind(this)}>Agregar</Button>
          </div>
        </Form.Item>
        <Form.Item className="inputs">
          <div className="label">Usuarios asignados:</div>
          {this.showUsers()}
        </Form.Item>
        <Form.Item className="buttons">
          { this.navigationButton(3)}
        </Form.Item>
      </Form>
    )
  }

  

  public currentStep(): any {
    if (this.props.match.params.id && !this.props.project) {
      return;
    }
    switch (this.state.current) {
      case 0:
        return this.info();
      case 1:
        return this.datasets();
      case 2:
        return this.entities();
      case 3:
        return this.users();
    }
  }

  public static getDerivedStateFromProps(props: any, state: any) {
    if (props.project) {
      state.project = props.project;
    } 
    return state;
  }

  public render() {
    return (
      <div className="project__create">
        <div className="steps">
          {this.showSteps()}
        </div>
        <div className="project__content">
          {this.currentStep()}
        </div>
      </div>
    )
  }
}

// Configure React-redux store functions
function mapStateToProps(state: any) {
    return {
      datasets: state.dataset.list,
      users: state.user.list,
      project: state.project.project
    }
  }
  
  function matchDispatchToProps(dispatch: any) {
    return bindActionCreators({
      setProject,
      destroyProject,
      editProject,
      getDatasets,
      getUsers,
      getProject
    }, dispatch);
  }
  
export default connect(mapStateToProps, matchDispatchToProps)(withRouter(DraftProjectComponent));