import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyBL1Ym0PO-I-3Ih-GNkZpprxn25P1qPfWI",
  authDomain: "shop-inventory-78923.firebaseapp.com",
  databaseURL: "https://shop-inventory-78923.firebaseio.com",
  projectId: "shop-inventory-78923",
  storageBucket: "shop-inventory-78923.appspot.com",
  messagingSenderId: "770959386387",
  appId: "1:770959386387:web:2db727edce93ecf07c5ce6",
  measurementId: "G-0LLT3EPPPV"
});
const inventoryDb = firebase.firestore();
// const inventory = [];
const fetchData = () => {
  return new Promise((resolve) => {
    inventoryDb.collection('inventory')
      .get()
      .then((querySnapshot) => {
        const inventory = [];
        querySnapshot.forEach((doc) => {
          inventory.push(doc.data());
        });
        resolve(inventory);
      })
      .catch((error) => {
        window.alert('There was an error completing your request. Try again.');
      });
  })
}

class SearchBar extends Component {
  render() {
    return (
      <div className='search-bar'>
        <input placeholder='Search...' type='text' onChange={this.props.search}/>
        <input type='checkbox' id='stock-check'onChange={this.props.checkFilter}/>
        <label htmlFor='stock-check'>
          Only show products in stock
        </label>
      </div>
    );
  }
}

class CategoryRow extends Component {
  render() {
    const category = this.props.category;
    return (
      <tr className='category'>
        <th colSpan='2'>
          {category}
        </th>
      </tr>
    );
  }
}

class ProductRow extends Component {
  render() {
    const product = this.props.product;
    const productRow = product.stocked ?
      product.name :
      <span className='out-of-stock'>
        {product.name}
      </span>

    return (
      <tr>
        <td>
          {productRow}
        </td>
        <td>
          {product.price}
        </td>
      </tr>
    );
  }
}

class ProductTable extends Component {
  render() {
    const products = this.props.products;
    const categories = Array.from(new Set(products.map((product) => product.category)));
    const productCollection = [];
    const searchTerm = this.props.searchTerm;
    const onlyStocked = this.props.onlyStocked;

    let index = 0;
    categories.forEach((category) => {
      const categorySet = [];
      categorySet.push(<CategoryRow category={category} key={++index}/>);
      products.filter((product) => product.category === category
        && (onlyStocked ? product.stocked : true)
        && (searchTerm.length ? product.name.toLowerCase().startsWith(searchTerm.toLowerCase()) : true))
        .forEach((product) => {
          categorySet.push(<ProductRow product={product} key={++index}/>)
        });
        productCollection.push(categorySet);
    })
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
            {productCollection.flat()}
        </tbody>
      </table>
    )
  }
}

class FilteredProductTable extends Component {
  render() {
    return (
      <div className="App">
        <SearchBar search={this.props.search} checkFilter={this.props.checkFilter}/>
        <ProductTable products = {this.props.products} searchTerm={this.props.searchTerm} onlyStocked={this.props.onlyStocked}/>
      </div>
    )
  }
}

class App extends Component {
  state = {
    products: [],
    searchString: '',
    onlyProductsInStock: false,
  }

  componentDidMount() {
    fetchData()
      .then((inventory) => {
        this.setState({
          products: inventory,
        })
      });
  }

  render() {
    const onSearchBoxChange = (event) => {
      this.setState({
        searchString: event.target.value,
      });
    }

    const filterSearchCheckboxChecked = (event) => {
      this.setState({
        onlyProductsInStock: event.target.checked,
      })
    }
    return (
      <div className="App">
        {this.state.products.length ?
          <FilteredProductTable products={this.state.products} search={onSearchBoxChange} checkFilter={filterSearchCheckboxChecked} searchTerm={this.state.searchString} onlyStocked={this.state.onlyProductsInStock}/> :
          'Fetching products...'}
      </div>
    );
  }
}

export default App;
