'use strict';
const moment = require('moment');
const util = require('util');
const soap = require('strong-soap').soap;
const XMLHandler = soap.XMLHandler;
const xmlHandler = new XMLHandler();
const loopback = require('loopback');
const nodemailer = require("nodemailer");
const mandrillTransport = require('nodemailer-mandrill-transport');
const xmljs = require('xml2json');
const phone = require('phone');

// backend bussiness logic
module.exports = {

  convertPhoneNumberFormat : function(phoneString){
    const phoneNumberArr = phone(phoneString);
    return phoneNumberArr[0];
  },

  convertDatalotFormat : async function(formData){
    let requestObject;
    formData.dateTime = moment(new Date(formData.dateTime));
    formData.dob = moment(new Date(formData.dob)).format("YYYY-MM-DD");
    formData.dobYear = moment(new Date(formData.dob)).format("YYYY");
    formData.dobMonth = moment(new Date(formData.dob)).format("MM");
    formData.dobDay = moment(new Date(formData.dob)).format("DD");

    // Convert json to xml
    requestObject = xmlHandler.jsonToXml(null, null,
      XMLHandler.createSOAPEnvelopeDescriptor('soap'), {
        contact_create: {
          access_key: "jg7wqflygb",
          source_id: "14270",
          product_id: "227",
          campaign_id: "healthhost1--" + formData.state,
          contact_permission: {
            phone_explicit: true,
            mobile_explicit: true,
            autodial_explicit: true,
            sms_explicit: true,
            mms_explicit: true,
            email_explicit: true,
            lead_id: formData.leadId,
            form_url: formData.originalURL,
            legal_language: formData.disclosure,
          },
          contact_info: {
            general_info: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              street1: formData.address,
              city: formData.city,
              state: formData.stateCode,
              zip_code: formData.postalCode,
              email: formData.email,
              phone_home: formData.phone.replace(/-/g, ""),
              preferred_phone: "H",
              ip_address: formData.ip,
              datetime_collected: formData.dateTime.toISOString(),
              user_agent: formData.userAgent,
              gender: formData.gender === "Male" ? "M" : "F",
              dob_day: formData.dobDay,
              dob_month: formData.dobMonth,
              dob_year: formData.dobYear
            },
            product_info: {
              height_feet: "5",
              height_inches: "8",
              weight: "160",
              age: moment(new Date, "YYYY-MM-DD").diff(formData.dob, 'years'),
              is_smoker: formData.tobaccoUser === "No" ? false : true,
              is_insured: false,
              household: formData.dependencies,
              income: formData.householdIncome,
              qualifying_life_event: formData.qualifyingEvent === "something-else" ? "no" : "yes"
            }
          },
          test: process.env.TEST_LEAD ? process.env.TEST_LEAD : false
        }
      });

    requestObject = requestObject.end({
      pretty: true,
    }); // Make xml pretty

    console.log(util.inspect(requestObject, false, null, true));
    return requestObject;
  },

  sendEmailDatalot : async function(responseData, emailData){
    let emailDob = moment(new Date(emailData.dob)).format("YYYY-MM-DD");

    responseData = JSON.parse(xmljs.toJson(responseData));

    console.log(util.inspect(responseData, false, null, true));

    if (responseData.response.success) {
      loopback.Email.send({
          to: emailData.email,
          template: {
            name: "healthcare-options",
          },
          global_merge_vars: [
            //in your mandrill template `*|team|*` or `*|TEAM|*`
            {
              name: 'ZIP_CODE',
              content: emailData.postalCode
            },
            {
              name: 'FIRST_NAME',
              content: emailData.firstName
            },
            {
              name: 'LAST_NAME',
              content: emailData.lastName
            },
            {
              name: 'STATE',
              content: emailData.state
            },
            {
              name: 'AGE',
              content: moment(new Date, "YYYY-MM-DD").diff(emailDob, 'years')
            },
            {
              name: 'GENDER',
              content: emailData.gender.toLowerCase()
            },
            {
              name: 'SMOKER',
              content: emailData.tobaccoUser
            },
            {
              name: 'DEPENDENCIES',
              content: emailData.dependencies
            },
            {
              name: 'INCOME',
              content: emailData.householdIncome
            },

          ]
        },
        function (err, result) {
          if (err) {
            console.log(err);
            return;
          }
          console.log(result);
        });
    }

    return responseData;
  },

  convertPxFormat: async function(formData){

    let requestObject;
    formData.dateTime = moment(new Date(formData.dateTime));
    formData.dob = moment(new Date(formData.dob)).format("YYYY-MM-DD");
    formData.dobYear = moment(new Date(formData.dob)).format("YYYY");
    formData.dobMonth = moment(new Date(formData.dob)).format("MM");
    formData.dobDay = moment(new Date(formData.dob)).format("DD");

    //format Household Income
    if (formData.householdIncome <= 30000) {
      formData.householdIncome = `Below $30,000`;
    } else if (formData.householdIncome > 30000 && formData.householdIncome <= 44999) {
      formData.householdIncome = `$30,000 - $44,999`;
    } else if (formData.householdIncome > 45000 && formData.householdIncome <= 59999) {
      formData.householdIncome = `$45,000 - $59,999`;
    } else if (formData.householdIncome > 60000 && formData.householdIncome <= 74999) {
      formData.householdIncome = `$60,000 - $74,999`;
    } else {
      formData.householdIncome = `Above $75,000`;
    }

    requestObject = {
      type: "jsonwsp/request",
      version: "1.0",
      methodname: "Lead.Insert",
      LeadData: {
        Target: "Lead.Insert",
        PartnerToken: "06A5189C-3B8F-4D5D-AD1B-B0EA9D55FC4D",
        // Partner: "insurancetest2@pp.com",
        // Password: "4insurancepp",
        RequestTime: formData.dateTime,
        UserAgent: formData.userAgent,
        OriginalURL: "https://www.healthcare.us.com",
        TCPAText: formData.disclosure,
        AffiliateData: {
          Id: "10204",
          OfferId: "220",
          SubId: "220",
          Source: "All",
          VerifyAddress: "false",
          RespondOnNoSale: "true",
          SellResponseURL: "",
          LeadId: formData.leadId,
          TrustedForm: formData.trustedForm,
          ClickConsentID: ""
        },
        ContactData: {
          FirstName: formData.firstName,
          LastName: formData.lastName,
          Address: formData.address,
          City: formData.city,
          State: formData.state,
          ZIPCode: formData.postalCode,
          EmailAddress: formData.email,
          PhoneNumber: formData.phone,
          IPAddress: formData.ip,
          ResidenceType: "My own house",
          MonthsAtResidence: 10
        },
        QuoteRequest: {
          QuoteType: "Health",
          Persons: {
            Person: {
              Id: "1",
              BirthDate: moment(new Date(formData.dob)).format("YYYY-MM-DD"),
              RelationshipToApplicant: "Self",
              Gender: formData.gender,
              USResidence: "True",
              HouseHoldIncome: formData.householdIncome,
              HouseHoldSize: formData.dependencies,
              Conditions: "None", //formData.conditions.join(','),
              Student: "False",
              Occupation: "Other",
              Education: "Bachelors Degree",
              MaritalStatus: "Single",
              DeniedInsurance: "No",
              Height_FT: "5",
              Height_Inch: "8",
              Weight: "160",
              MedicalHistory: {
                Hospitalized: "No",
                Pregnant: formData.pregnant,
                Smoker: formData.tobaccoUser,
                Alcoholabstain: "Yes"

              }
            }
          },
          Insurance: {
            RequestedPolicy: {
              CoverageType: formData.coverageType ? formData.coverageType : "Individual Family"
            },
            CurrentPolicy: {
              InsuranceCompany: "Currently not insured"
            }
          }
        }
      }
    }

    console.log(util.inspect(requestObject, false, null, true));

    return requestObject;

  },

  sendEmailPx : function(responseData){
    console.log(util.inspect(responseData, false, null, true));
    return;
  }
}
