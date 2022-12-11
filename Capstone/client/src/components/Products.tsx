import { History } from 'history'
import * as React from 'react'
import {
  Form,
  Button,
  Grid,
  Header,
  Loader,
  Modal,
  ItemGroup,
  Item,
  Icon
} from 'semantic-ui-react'

import { createProduct, deleteProduct, getProducts } from '../api/products-api'
import Auth from '../auth/Auth'
import { Product } from '../types/Product'

interface ProductsProps {
  auth: Auth
  history: History
}

interface ProductsState {
  products: Product[]
  name: string
  description: string
  price: number
  quantity: number
  loadingProducts: boolean
  showModal: boolean
}

export class Products extends React.PureComponent<ProductsProps, ProductsState> {

  noImageUrl: string = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'

  state: ProductsState = {
    products: [],
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    loadingProducts: true,
    showModal: false
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ description: event.target.value })
  }

  handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ price: Number.parseFloat(event.target.value) })
  }

  handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ quantity: Number.parseFloat(event.target.value) })
  }

  onEditButtonClick = (productId: string) => {
    this.props.history.push(`/products/${productId}/edit`)
  }

  onProductCreate = async () => {
    try {
      const newProduct = await createProduct(this.props.auth.getIdToken(), {
        name: this.state.name,
        description: this.state.description,
        price: this.state.price,
        quantity: this.state.quantity,
      })
      this.setState({
        products: [...this.state.products, newProduct],
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        showModal: false
      })
    } catch (err) {
      console.log(err)
      alert(`Product creation fail: ${(err as Error).message}`)
    }
  }

  onProductDelete = async (productId: string) => {
    try {
      await deleteProduct(this.props.auth.getIdToken(), productId)
      this.setState({
        products: this.state.products.filter(product => product.productId !== productId)
      })
    } catch (err) {
      console.log(err)
      alert('Todo deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const products = await getProducts(this.props.auth.getIdToken())
      this.setState({
        products,
        loadingProducts: false
      })
    } catch (err) {
      console.log(err)
      alert(`Failed to fetch todos: ${(err as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Products</Header>

        <Button
          content="Add product"
          labelPosition='right'
          icon='add'
          onClick={() => this.setState({ showModal: true })}
          positive
        />

        {this.renderCreateProductInput()}

        {this.renderProducts()}
      </div>
    )
  }

  renderCreateProductInput() {
    return (
      <Modal
        open={this.state.showModal}
      >
        <Modal.Header>Add task</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <Form>
              <Form.Field>
                <label>Product name</label>
                <input placeholder='Ex: Product 1' onChange={this.handleNameChange} />
              </Form.Field>
              <Form.Field>
                <label>Description</label>
                <input placeholder='Ex: This is the first product ...' onChange={this.handleDescriptionChange} />
              </Form.Field>
              <Form.Field>
                <label>Price (VND)</label>
                <input placeholder='Ex: 25000' type='number' onChange={this.handlePriceChange} />
              </Form.Field>
              <Form.Field>
                <label>Quantity</label>
                <input placeholder='Ex: 10' type='number' onChange={this.handleQuantityChange} />
              </Form.Field>
              <Button type='submit' primary onClick={this.onProductCreate}>Create</Button>
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => this.setState({ showModal: false })}>
            Cancel
          </Button>
          <Button
            type='submit'
            content="Create"
            labelPosition='right'
            icon='add'
            onClick={() => this.onProductCreate()}
            positive
          />
        </Modal.Actions>
      </Modal>
    )
  }

  renderProducts() {
    if (this.state.loadingProducts) {
      return this.renderLoading()
    }

    return this.renderProductsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Products
        </Loader>
      </Grid.Row>
    )
  }

  renderProductsList() {
    return (
      <ItemGroup>
        {this.state.products.map(product => {
          return (
            <Item>
              <Item.Image size='small' src={product.image ? product.image : this.noImageUrl} />
              <Item.Content>
                <Item.Header>{product.name}</Item.Header>
                <Item.Meta>
                  <span className='price'>{product.price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</span><br />
                </Item.Meta>
                <Item.Description>{product.description}</Item.Description>
                <Item.Meta>
                  <span className='quantity'>{'Quantity:'+ product.quantity}</span>
                </Item.Meta>
                <Item.Description>
                  <Button
                    icon
                    color="blue"
                    onClick={() => this.onEditButtonClick(product.productId)}
                  >
                    <Icon name="pencil" />
                  </Button>
                  <Button
                    icon
                    color="red"
                    onClick={() => this.onProductDelete(product.productId)}
                  >
                    <Icon name="delete" />
                  </Button>
                </Item.Description>
              </Item.Content>
            </Item>
          )
        })}
      </ItemGroup>
    )
  }
}
