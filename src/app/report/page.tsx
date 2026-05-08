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
  FiCheckSquare,
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

export default function ItemBalanceReport() {
  const [stockLocation, setStockLocation] = useState<string>("");
  const [itemGroup, setItemGroup] = useState<string>("");
  const [showGrnWise, setShowGrnWise] = useState<boolean>(false);

  const [itemGroupOptions, setItemGroupOptions] = useState<OptionType[]>(
    []
  );

  const [loadingGroups, setLoadingGroups] =
    useState<boolean>(false);

  //------------------fetch data from backend----------------------------------------------------------//

  useEffect(() => {
    const fetchItemGroups = async () => {
      setLoadingGroups(true);

      try {
       
        //--localhost:8081/api/report---------------------------------
        const response = await API.get("/api/report");

        const options: OptionType[] = response.data.map(
          (group: string) => ({
            label: group,
            value: group,
          })
        );

        //---------All option-------------------------------------------
        options.unshift({
          label: "All",
          value: "All",
        });

        setItemGroupOptions(options);
      } catch (error) {
        console.error("Failed to fetch item groups:", error);
        alert("Failed to load item groups");
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchItemGroups();
  }, []);



  //------------Report generation part----------------------------------------------------------------//

  const handleGenerateReport = async () => {
    try {
      if (!stockLocation || !itemGroup) {
        alert("Please select location and item group");
        return;
      }

      const response = await API.get( "/api/report/reports/balance/pdf",
        {
          params: {
            location: stockLocation,
            groupName: itemGroup,
            isGrnWise: showGrnWise,
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        showGrnWise
          ? "grn-summary-report.pdf"
          : "item-summary-report.pdf"
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Report generation failed:", error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
      }

      alert("Failed to generate report");
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

              <h2 className="text-2xl text-white font-semibold">
                View Item Balance
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
                  onChange={(
                    e: React.ChangeEvent<HTMLSelectElement>
                  ) =>
                    setStockLocation(e.target.value)
                  }
                />

                {/* ITEM GROUP */}
                <FormInput
                  type="select"
                  label="Item Group"
                  icon={FiCheckSquare}
                  options={
                    loadingGroups
                      ? [
                          {
                            label: "Loading...",
                            value: "",
                          },
                        ]
                      : itemGroupOptions
                  }
                  value={itemGroup}
                  onChange={(
                    e: React.ChangeEvent<HTMLSelectElement>
                  ) =>
                    setItemGroup(e.target.value)
                  }


                  //disabled={loadingGroups}

                  
                />

                {/* CHECKBOX + BUTTON */}
                <div className="flex flex-col sm:flex-row justify-end items-end gap-6 pt-4">

                  <FormInput
                    type="checkbox"
                    label="Show GRN Wise Report"
                    value={showGrnWise}
                    onChange={(
                      e: React.ChangeEvent<HTMLInputElement>
                    ) =>
                      setShowGrnWise(
                        e.target.checked
                      )
                    }
                  />

                  <Button
                    variant="primary"
                    icon={FiPrinter}
                    onClick={handleGenerateReport}
                    className="px-8 py-3 shadow-lg"
                  >
                    Generate Report
                  </Button>

                </div>
              </div>
            </div>
    </ReportsLayout>
  );
}
