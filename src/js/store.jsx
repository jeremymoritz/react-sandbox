//	React Sporting Goods Store Tutorial

var ProductRow = React.createClass({
	render: function render() {
		var product = this.props.product;
		return (
			<tr>
				<td>{product.name}</td>
				<td>{product.price}</td>
			</tr>
		);
	}
});

var ProductCategory = React.createClass({
	render: function render() {
		var products = this.props.products;
		var categoryName = this.props.category;
		var productRows = products.map(function mapEachProduct(product) {
			return (
				<ProductRow product={product} />
			);
		});

		return (
			<tbody>
				<tr>
					<th colSpan="2">{categoryName}</th>
				</tr>
				{productRows}
			</tbody>
		);
	}
});

var SearchBar = React.createClass({
	handleChange: function handleChange() {
		this.props.onUserInput(
			this.refs.filterText.getDOMNode().value,
			this.refs.inStockOnly.getDOMNode().checked
		);
	},
	render: function render() {
		return (
			<div className="searchBar">
				<form role="form">
					<input 
						type="text" 
						ref="filterText" 
						placeholder="Search..." 
						value={this.props.filterText} 
						onChange={this.handleChange}
					/>
					<br />
					<label>
						<input 
							type="checkbox" 
							ref="inStockOnly" 
							checked={this.props.inStockOnly} 
							onChange={this.handleChange}
						/>
						{' '}
						Only show products in stock
					</label>
				</form>
			</div>
		);
	}
});

var ProductTable = React.createClass({
	render: function render() {
		var self = this;
		var filteredProducts = this.props.products;
		if (this.props.inStockOnly) {	//	handle inStockOnly
			filteredProducts =  _.filter(filteredProducts, 'stocked');
		}
		if (this.props.filterText) {	//	handle filterText
			filteredProducts = _.filter(filteredProducts, function filterProducts(prod) {
				return _.includes(prod.name, self .props.filterText);
			});
		}

		var groupedProducts = _.groupBy(filteredProducts, 'category');
		var productCategories = [];
		_.forOwn(groupedProducts, function eachProp(products, categoryName) {
			productCategories.push(
				<ProductCategory products={products} category={categoryName} />
			);
		});

		return (
			<div className="productTable">
				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Price</th>
						</tr>
					</thead>
					{productCategories}
				</table>
			</div>
		);
	}
});

var FilterableProductTable = React.createClass({
	loadProductsFromServer: function() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			success: function(data) {
				this.setState({products: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	getInitialState: function() {
		return {
			products: [],
			filterText: '',
			inStockOnly: false
		};
	},
	handleUserInput: function handleUserInput(filterText, inStockOnly) {
		this.setState({
			filterText: filterText,
			inStockOnly: inStockOnly
		});
	},
	componentDidMount: function() {
		this.loadProductsFromServer();
		setInterval(this.loadProductsFromServer, this.props.pollInterval);
	},
	render: function render() {
		return (
			<div className="filterProductTable">
				<SearchBar 
					inStockOnly={this.state.inStockOnly} 
					filterText={this.state.filterText} 
					onUserInput={this.handleUserInput}
				/>
				<ProductTable products={this.state.products} inStockOnly={this.state.inStockOnly} filterText={this.state.filterText} />
			</div>
		);
	}
});

React.render(
	<FilterableProductTable url="resources/products.json" pollInterval={2000} />,
	document.getElementById('store')
);























// var Comment = React.createClass({
//   render: function() {
//     return (
//       <div className="comment">
//         <h3 className="commentAuthor">{this.props.author}</h3>
//         <span dangerouslySetInnerHTML={{__html: this.props.children.toString()}} />
//       </div>
//     );
//   }
// });

// var CommentList = React.createClass({
//   render: function() {
//     var commentNodes = this.props.data.map(function (comment) {
//       return (
//         <Comment author={comment.author}>
//           {comment.text}
//         </Comment>
//       );
//     });
//     commentNodes.reverse();	//	put newest at the top
//     return (
//       <div className="commentList">
//         {commentNodes}
//       </div>
//     );
//   }
// });

// var CommentForm = React.createClass({
// 	handleSubmit: function (e) {
// 		e.preventDefault();
// 		var author = React.findDOMNode(this.refs.author).value.trim();
// 		var text = React.findDOMNode(this.refs.text).value.trim();
// 		if (!text || !author) {
// 			return;
// 		}

// 		this.props.onCommentSubmit({author: author, text: text});
// 		React.findDOMNode(this.refs.author).value = '';
// 		React.findDOMNode(this.refs.text).value = '';
// 		return;
// 	},
//   render: function() {
//     return (
//     	<form className="commentForm" onSubmit={this.handleSubmit}>
//         <input type="text" ref="author" placeholder="Your Name" />
//         <input type="text" ref="text" placeholder="Say something..." />
//         <input type="submit" value="Post" />
//       </form>
//     );
//   }
// });

// var CommentBox = React.createClass({
//   loadCommentsFromServer: function() {
//     $.ajax({
//       url: this.props.url,
//       dataType: 'json',
//       success: function(data) {
//         this.setState({data: data});
//       }.bind(this),
//       error: function(xhr, status, err) {
//         console.error(this.props.url, status, err.toString());
//       }.bind(this)
//     });
//   },
//   handleCommentSubmit: function (comment) {
//     var comments = this.state.data;
//     var commentsWithNewCommentAppended = comments.concat([comment]);
//     this.setState({data: commentsWithNewCommentAppended});

//   	console.log(comment);	//	in browser console

//   	$.ajax({
//       url: this.props.url,
//       dataType: 'json',
//       type: 'POST',
//       data: comment,
//       success: function(data) {
//         this.setState({data: data});
//       }.bind(this),
//       error: function(xhr, status, err) {
//         console.error(this.props.url, status, err.toString());
//       }.bind(this)
//     });
//   },
//   getInitialState: function() {
//     return {data: []};
//   },
//   componentDidMount: function() {
//     this.loadCommentsFromServer();
//     setInterval(this.loadCommentsFromServer, this.props.pollInterval);
//   },
//   render: function() {
//     return (
//       <div className="commentBox">
//         <h1>Comments</h1>
//         <CommentForm onCommentSubmit={this.handleCommentSubmit} />
//         <h2>Past Comments</h2>
//         <CommentList data={this.state.data} />
//       </div>
//     );
//   }
// });

// React.render(
//   <CommentBox url="resources/comments.json" pollInterval={5000} />,
//   document.getElementById('store')
// );