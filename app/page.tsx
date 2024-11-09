"use client";
import React, { useState } from "react";
import transactionData from "../constants/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const rowsOptions = [5, 10, 25, 50];

  const totalPages = Math.ceil(transactionData.length / rowsPerPage);

  // Calculate the data for the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = transactionData.slice(indexOfFirstRow, indexOfLastRow);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  function shortenHash(hashStr: string, length = 4) {
    // If the hash is too short to shorten, return it as is
    if (hashStr.length <= length * 2) {
      return hashStr;
    }

    // Take the specified number of characters from start and end
    return `${hashStr.slice(0, length)}...${hashStr.slice(-length)}`;
  }

  function formatDate(dateString: string) {
    // Parse the date string into a Date object
    const date = new Date(dateString);

    // Get month names
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Format components
    const month = monthNames[date.getUTCMonth()];
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    // Combine into the desired format
    return `${month} ${day}, ${hours}:${minutes}:${seconds}`;
  }

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to the first page when rows per page changes
  };

  return (
    <div
      style={{ backgroundColor: "#1c1c1f" }}
      className="flex font-sans items-center justify-center h-screen bg-gray-900"
    >
      <div
        style={{ backgroundColor: "#2d2e30" }}
        className="text-white rounded-lg bg-gray-800 shadow-lg p-6 w-[75%] h-[500px]"
      >
        <div className="overflow-auto text-sm h-[85%]">
          <table className="w-full table-auto">
            <thead>
              <tr className=" font-semibold text-gray-400">
                <th className="p-2 text-left">Block</th>
                <th className="p-2 text-left">Hash</th>
                <th className="p-2 text-left">Timestamp</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">From</th>
                <th className="p-2 text-left">Net</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Fee</th>
              </tr>
            </thead>
            <div className="h-[15px]"></div>
            <tbody>
              {currentRows.map((transaction, index) => (
                <tr
                  key={index}
                  className={`border-t h-[55px] whitespace-nowrap border-gray-600 text-blue-400`}
                >
                  <td className=" p-2 ">{transaction.block}</td>
                  <td className="p-2 ">{transaction.hash}</td>
                  <td className=" p-2  text-gray-400">
                    {transaction.timestamp}
                  </td>
                  <td className=" p-2">
                    <img
                      src="/success.png"
                      alt=""
                      className="w-[20px] h-[20px]"
                    />
                  </td>
                  <td className=" p-2 ">{transaction.from}</td>
                  <td
                    className={` p-2 font-semibold ${
                      transaction.net[0] === "-"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {transaction.net}
                  </td>
                  <td className="whitespace-normal leading-relaxed p-2">
                    <span className="bg-gray-500 px-[8px] pb-[2px] text-gray-200 text-xs rounded-sm">
                      {transaction.description.split(" ").slice(0, 2).join(" ")}
                    </span>{" "}
                    {transaction.description
                      .split(" ")
                      .slice(2)
                      .map((word, index) => {
                        // Check if the word contains digits, "Code", or "..."
                        const isAlphanumericOrSpecial =
                          /\d/.test(word) ||
                          word.includes("Code") ||
                          word.includes("...");

                        return (
                          <span
                            key={index}
                            className={
                              isAlphanumericOrSpecial
                                ? "text-blue-400"
                                : "text-gray-400 font-semibold"
                            }
                          >
                            {word}
                          </span>
                        );
                      })
                      .reduce(
                        (acc, elem) =>
                          acc === null ? [elem] : [...acc, " ", elem],
                        null
                      )}
                  </td>
                  <td className=" p-2 pr-[30px] text-gray-400 font-semibold">
                    {transaction.fee}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination and Rows per Page Controls in the Footer */}
        <div className="flex w-[100%] justify-end items-center mt-4 py-2 pr-4">
          <div className="flex justify-end gap-4 items-center rounded-b-lg px-4">
            {/* Rows Per Page Selector */}
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              {/* <Dropdown
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
              /> */}

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex items-center justify-center bg-[#3d3e40] px-3 py-2 rounded">
                    {rowsPerPage}
                    <svg
                      className="-mr-1 ml-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06 0L10 10.93l3.71-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#343434] text-white border-gray-500">
                  {rowsOptions.map((option) => (
                    <div>
                      <DropdownMenuItem
                        onClick={() => {
                          setRowsPerPage(option);
                          setCurrentPage(1);
                        }}
                        className="bg-[#343434] hover:bg-[#212226] "
                      >
                        {option}
                      </DropdownMenuItem>
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-3 space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className=" text-white p-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <div>
                {currentPage} of {totalPages}
              </div>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className=" text-white px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
