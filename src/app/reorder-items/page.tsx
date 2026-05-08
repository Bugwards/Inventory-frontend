"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import ReportsLayout from "@/components/Reportslayout";

import {
  FiEye,
  FiPrinter,
  FiMapPin,
  FiSquare,
} from "react-icons/fi";

type OptionType = {
  label: string;
  value: string;
};

const API = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

export default function ViewReOrderItems() {

  const [stockLocation, setStockLocation] = useState<string>("");

  const [itemGroup, setItemGroup] = useState<string>("");

  const [itemGroupOptions, setItemGroupOptions] = useState<OptionType[]>([]);
  

  //-----fetching data-----------------------------------------------------------------------------------//

  useEffect(() => {

    const fetchItemGroups = async () => {

      try {

        const response = await API.get("/api/report");

        console.log(response.data);

        const options: OptionType[] =
          response.data.map((group: string) => ({
            label: group,
            value: group,
          }));

        //-------optional ALL option----------------------------------------------------------------------//

        options.unshift({
          label: "All",
          value: "All",
        });

        setItemGroupOptions(options);

      } catch (error) {

        console.error(
          "Failed to fetch item groups:",
          error
        );

        alert("Failed to load item groups");
      }
    };

    fetchItemGroups();

  }, []);

  //--------------------report generation-----------------------------------------------------------------//

  const handleGenerateReport = async () => {

    try {

      if (!stockLocation || !itemGroup) {

        alert("Please select all fields");

        return;
      }

      const response = await API.get( "/api/report/reports/reorder/pdf",
        {
          params: {
            location: stockLocation,
            groupName: itemGroup,
          },

          responseType: "blob",
        }
      );

      //--------------PDF download-----------------------------------------------------------------------//

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        "reorder-report.pdf"
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {

      console.error(error);

      alert("Error generating report");
    }
  };

  return (
    <ReportsLayout>

            {/* HEADER */}
            <div className="bg-gradient-to-r from-orange-400 to-amber-700 rounded-xl p-4 flex items-center gap-3 shadow-lg mb-8">

              <FiEye
                size={28}
                className="text-white"
              />

              <h2 className="text-2xl text-white">
                View Re-Order Item Balance
              </h2>

            </div>

            {/* FORM CARD */}
            <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-4xl">

              <div className="space-y-6 max-w-2xl">

                {/* LOCATION */}
                <FormInput
                  type="select"
                  label="Stock Location"
                  icon={FiMapPin}
                  options={[
                    {
                      label: "Head Office",
                      value: "HEAD_OFFICE",
                    },
                    {
                      label: "Kalutara",
                      value: "KALUTARA",
                    },
                    {
                      label: "Kandy",
                      value: "KANDY",
                    },
                    {
                      label: "Galle",
                      value: "GALLE",
                    },
                    {
                      label: "Gampaha",
                      value: "GAMPAHA",
                    },
                    {
                      label: "Anuradhapura",
                      value: "ANURADHAPURA",
                    },
                  ]}
                  value={stockLocation}
                  onChange={(e) =>
                    setStockLocation(e.target.value)
                  }
                />

                {/* ITEM GROUP */}
                <FormInput
                  type="select"
                  label="Item Group"
                  icon={FiSquare}
                  options={itemGroupOptions}
                  value={itemGroup}
                  onChange={(e) =>
                    setItemGroup(e.target.value)
                  }
                />

                {/* BUTTON */}
                <div className="flex justify-end pt-4">

                  <Button
                    variant="primary"
                    icon={FiPrinter}
                    onClick={handleGenerateReport}
                  >
                    Generate Report
                  </Button>

                </div>

              </div>
            </div>

    </ReportsLayout>
  );
}
