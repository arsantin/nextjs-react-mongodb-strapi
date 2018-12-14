import gql from "graphql-tag";
import { withRouter } from "next/router";
import { graphql } from "react-apollo";
import { compose } from "recompose";
import { withContext } from "../components/Context/AppProvider";
import {
  Button,
  Card,
  CardBody,
  CardColumns,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Row
} from "reactstrap";
import Cart from "../components/Cart/Cart";
import defaultPage from "../components/hoc/defaultPage";

class Trucks extends React.Component {
  constructor(props) {
    super(props);
  }

  addItem(item) {
    this.props.context.addItem(item);
  }
  render() {
    const {
      data: { loading, error, truck },
      router,
      context,
      isAuthenticated
    } = this.props;
    if (error) return "Error Loading Dishes";

    if (truck) {
      return (
        <>
          <h1>{truck.nome}</h1>
          <Row>
            <Col xs="9" style={{ padding: 0 }}>
              <div style={{ display: "inline-block" }} className="h-100">
                {truck.cardapios.map(res => (
                  <Card
                    style={{ width: "30%", margin: "0 10px" }}
                    key={res._id}
                  >
                    <CardImg
                      top={true}
                      style={{ height: 250 }}
                      src={`http://localhost:1337${res.imagem.url}`}
                    />
                    <CardBody>
                      <CardTitle>{res.nome}</CardTitle>
                      <CardText>{res.descricao}</CardText>
                    </CardBody>
                    <div className="card-footer">
                      <Button
                        onClick={this.addItem.bind(this, res)}
                        outline
                        color="primary"
                      >
                        + Add To Cart
                      </Button>

                      <style jsx>
                        {`
                          a {
                            color: white;
                          }
                          a:link {
                            text-decoration: none;
                            color: white;
                          }
                          .container-fluid {
                            margin-bottom: 30px;
                          }
                          .btn-outline-primary {
                            color: #007bff !important;
                          }
                          a:hover {
                            color: white !important;
                          }
                        `}
                      </style>
                    </div>
                  </Card>
                ))}
              </div>
            </Col>
            <Col xs="3" style={{ padding: 0 }}>
              <div>
                <Cart isAuthenticated={isAuthenticated} />
              </div>
            </Col>
          </Row>
        </>
      );
    }
    return <h1>Loading</h1>;
  }
}

const GET_truck_DISHES = gql`
  query($id: ID!) {
    truck(id: $id) {
      _id
      nome
      cardapios {
        _id
        nome
        descricao
        valor
        imagem {
          url
        }
      }
    }
  }
`;
// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (truckList)

export default compose(
  withRouter,
  defaultPage,
  withContext,
  graphql(GET_truck_DISHES, {
    options: props => {
      return {
        variables: {
          id: props.router.query.id
        }
      };
    },
    props: ({ data }) => ({ data })
  })
)(Trucks);