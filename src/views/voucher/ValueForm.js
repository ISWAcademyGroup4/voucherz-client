import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ScaleLoader from "react-spinners/ScaleLoader";
import { createVoucherUrl } from "../../util/APIUtils";
import { notification } from "antd";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    width: "98%",
    margin: "0 auto"
  },
  button: {
    marginTop: 20,
    margin: theme.spacing.unit
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 280
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 170
  },
  btnColor: {
    backgroundColor: "#0bf"
  }
});
const override = {
  display: "block",
  margin: "140px 0 140px 400px"
};
notification.config({
  placement: "bottomRight",
  bottom: 200,
  duration: 0
});

class ValueTextFields extends React.Component {
  state = {
    vData: {
      campaignName: "",
      amount: "",
      valueSpec: "",
      suffix: "",
      prefix: "",
      charSet: "",
      voucherLength: "",
      startDate: "",
      expiryDate: ""
    },
    voucherType: "Value",
    voucherCategory: "Standalone",
    charSet: [
      {
        value: "Numeric",
        label: "Numeric"
      },
      {
        value: "Alphanumeric",
        label: "Alphanumeric"
      },
      {
        value: "Alphabet",
        label: "Alphabet"
      }
    ],
    disabled: true,
    isLoading: false,
    errorStatus: false
  };
  handleChangeText = e => {
    let value = e.target.value;
    let name = e.target.name;
    this.setState(prevState => ({
      vData: {
        ...prevState.vData,
        [name]: value
      }
    }));
  };
  handleChange = e => {
    let value = e.target.value;
    let name = e.target.name;
    const validateinput = /^[+]?([0-9]+(?:[./][0-9]*)?|\.[0-9]+)$/;
    if (e.target.value === "" || validateinput.test(e.target.value)) {
      this.setState(prevState => ({
        vData: {
          ...prevState.vData,
          [name]: value
        }
      }));
    }
  };
  handleClearForm = e => {
    e.preventDefault();
    this.setState({
      vData: {
        campaignName: "",
        amount: "",
        valueSpec: "",
        suffix: "",
        prefix: "",
        charSet: "",
        voucherLength: "",
        startDate: "",
        expiryDate: ""
      },
      voucherType: "Value",
      voucherCategory: "Standalone",
      charSet: [
        {
          value: "Numeric",
          label: "Numeric"
        },
        {
          value: "Alphanumeric",
          label: "Alphanumeric"
        },
        {
          value: "Alphabet",
          label: "Alphabet"
        }
      ],
      disabled: true,
      isLoading: false,
      errorStatus: false
    });
  };
  dateCharsethandler = e => {
    let value = e.target.value;
    let name = e.target.name;
    this.setState(prevState => ({
      vData: {
        ...prevState.vData,
        [name]: value
      }
    }));
  };
  handleFormSubmit = e => {
    e.preventDefault();
    this.setState({ ...this.state, isLoading: true });
    let valueData = {
      VoucherType: this.state.voucherType,
      Campaign: this.state.vData.campaignName,
      Value: {
        Amount: this.state.vData.amount,
        Value_Type: this.state.vData.valueSpec
      },
      startDate: this.state.vData.startDate,
      expirationDate: this.state.vData.expiryDate,
      MetaData: {
        Length: this.state.vData.voucherLength,
        Charset: this.state.vData.charSet,
        Prefix: this.state.vData.prefix,
        Suffix: this.state.vData.suffix
      },
      CreatedBy: "Stephen",
      VoucherCount: "1"
    };
    createVoucherUrl(valueData)
      .then(response => {
        console.log(response);
        let res = response;
        if (res.status === 201) {
          this.setState({ ...this.state, isLoading: false, modalShow: true });
        }
        notification.success({
          message: "Voucherz",
          description: "Thank you! You've successfully created your vouchers"
        });
      })
      .catch(error => {
        console.error(
          "Error:",
          error ||
            "Problem tryin to upload. Click the cancel button to clear the form and try again. Thank you!"
        );
        this.setState({
          ...this.state,
          isLoading: false,
          errorStatus: true
        });
        notification.error({
          message: "Voucherz",
          description:
            "Your request cannot be made at this time as the server is currently unreachable. Click the cancel button to clear the form and try again. Thank you! " ||
            "Sorry! Something went wrong. Click the cancel button to clear the form and try again. Thank you!"
        });
        console.log(valueData);
      });
  };

  render() {
    const { classes } = this.props;

    return (
      <Grid md={12}>
        {!this.state.isLoading ? (
          <form className={classes.container} noValidate autoComplete="off">
            <Grid md={12}>
              <TextField
                id="filled-select-voucher-charSet"
                select
                required
                label="Charset"
                name={"charSet"}
                className={classes.textField}
                value={this.state.vData.charSet}
                onChange={this.dateCharsethandler}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu
                  }
                }}
                margin="normal"
              >
                {this.state.charSet.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="filled-number"
                label="Voucher Amount"
                name={"amount"}
                value={this.state.vData.amount}
                onChange={this.handleChange}
                type="number"
                className={classes.textField}
                margin="normal"
                required
              />
              <TextField
                id="filled-name"
                label="Input campaign name"
                name={"campaignName"}
                className={classes.textField}
                value={this.state.vData.campaignName}
                onChange={this.handleChangeText}
                margin="normal"
                required
              />
            </Grid>
            <Grid md={12}>
              <TextField
                id="filled-name"
                label="Value spec e.g Airtime, Paycode etc"
                name={"valueSpec"}
                className={classes.textField}
                value={this.state.vData.valueSpec}
                onChange={this.handleChangeText}
                margin="normal"
                required
              />
              <TextField
                id="filled-name"
                label="Voucher Prefix (Optional)"
                name={"prefix"}
                className={classes.textField}
                value={this.state.vData.prefix}
                onChange={this.handleChangeText}
                margin="normal"
              />
              <TextField
                id="filled-name"
                label="Voucher suffix (Optional)"
                name={"suffix"}
                className={classes.textField}
                value={this.state.vData.suffix}
                onChange={this.handleChangeText}
                margin="normal"
              />
            </Grid>
            <Grid md={12}>
              <TextField
                id="filled-number"
                label="Voucher Length"
                name={"voucherLength"}
                value={this.state.vData.voucherLength}
                onChange={this.handleChange}
                type="number"
                className={classes.textField}
                margin="normal"
                required
              />
              <TextField
                id="filled-date"
                label="Start Date"
                name={"startDate"}
                value={this.state.vData.startDate}
                onChange={this.dateCharsethandler}
                type="date"
                className={classes.textField}
                margin="normal"
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                id="filled-date"
                label="Expiry Date"
                name={"expiryDate"}
                value={this.state.vData.expiryDate}
                onChange={this.dateCharsethandler}
                type="date"
                className={classes.textField}
                required
                margin="normal"
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid md={12}>
              <Button
                color="primary"
                variant="contained"
                className={`${classes.button} ${classes.btnColor}`}
                disabled={
                  this.state.vData.campaignName !== "" &&
                  this.state.vData.charSet !== "" &&
                  this.state.vData.amount !== "" &&
                  this.state.vData.valueSpec !== "" &&
                  this.state.vData.expiryDate !== "" &&
                  this.state.vData.voucherLength !== "" &&
                  this.state.vData.startDate !== ""
                    ? !this.state.disabled
                    : this.state.disabled
                }
                onClick={this.handleFormSubmit}
              >
                Generate
              </Button>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={this.handleClearForm}
              >
                Cancel
              </Button>
            </Grid>
          </form>
        ) : (
          <Grid md={12} xs={12} sm={12} justify="center" alignContent="center">
            <ScaleLoader
              css={override}
              color={"#0bf"}
              size={300}
              sizeUnit={"px"}
            />
          </Grid>
        )}
      </Grid>
    );
  }
}

ValueTextFields.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ValueTextFields);
