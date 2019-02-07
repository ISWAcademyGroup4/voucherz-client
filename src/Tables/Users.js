import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
  Row,
  Col
} from "reactstrap";

import axios from "axios";
import ScaleLoader from "react-spinners/ScaleLoader";
import UserDialogDemo from "../views/Products/UserDialog";

const override = {
  display: "block",
  margin: "50px 45%",
  borderColor: "red"
};

class UsersTable extends React.Component {
  state = {
    user: [],
    isLoading: true,
    error: null
  };
  componentDidMount() {
    axios
      .get("https://172.20.20.23:5001/getalldiscount?Merchant=Enunwah", {
        responseType: "json"
      })
      .then(response => {
        const newUser = response.data;
        let voucherDataArr = Object.keys(newUser).reduce((arr, e) => {
          arr.push(newUser[e]);
          return arr;
        }, []);
        this.setState({
          voucher: voucherDataArr,
          isLoading: false
        });
        // eslint-disable-next-line no-console
        console.log(voucherDataArr);
      })
      .catch(error =>
        this.setState({
          ...this.state,
          error: error,
          isLoading: false
        })
      );
  }
  render() {
    return (
      <div className="content">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Users Table</CardTitle>
              </CardHeader>
              <CardBody>
                {!this.state.isLoading ? (
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th className="text-left">First-Name</th>
                        <th className="text-left">Last-Name</th>
                        <th className="text-left">Email</th>
                        <th className="text-left">Role</th>
                        <th className="text-left">Date-Created</th>
                        <th className="text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.user.map(item => (
                        <tr key={item.user.email}>
                          <td>{item.user.firstName}</td>
                          <td>{item.user.lastName}</td>
                          <td>{item.user.email}</td>
                          <td>{item.user.role}</td>
                          <td>{item.dateCreated}</td>
                          <td>
                            <UserDialogDemo
                              firstName={item.firstName}
                              lastName={item.lastName}
                              email={item.email}
                              role={item.role}
                              dateCreated={item.dateCreated}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <ScaleLoader
                    css={override}
                    color={"#0bf"}
                    size={300}
                    sizeUnit={"px"}
                  />
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
export default UsersTable;
