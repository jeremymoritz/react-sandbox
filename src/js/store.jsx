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

var ProductTable = React.createClass({
	render: function render() {
	  var groupedProducts = _.groupBy(this.props.products, 'category');
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

var SearchBar = React.createClass({
	render: function render() {
		return (
			<div className="searchBar">
				<input type="text" ref="searchText" placeholder="Search..." />
				<br />
				<label>
					<input type="checkbox" ref="inStockOnly" /> 
					Only show products in stock
				</label>
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
    return {products: []};
  },
  componentDidMount: function() {
    this.loadProductsFromServer();
    setInterval(this.loadProductsFromServer, this.props.pollInterval);
  },
	render: function render() {
		return (
			<div className="filterProductTable">
				<SearchBar />
				<ProductTable products={this.state.products} />
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