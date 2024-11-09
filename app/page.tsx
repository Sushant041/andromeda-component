"use client";
import React, { useState } from "react";
import transactionData from "@/constants/json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const rowsOptions = [15, 25, 50];

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

  const tokenMap = new Map([
    ["uluna", "LUNA"],
    [
      "terra1lxx40s29qvkrcj8fsa3yzyehy7w50umdvvnls2r830rys6lu2zns63eelv",
      "ROAR",
    ],
  ]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  function shortenHash(hashStr: string, length = 4) {
    // If the hash is too short to shorten, return it as is
    if (hashStr?.length <= length * 2) {
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

  function formatUnits(input: string) {
    // Regular expression to match numbers followed by alphanumeric units
    const longUnit =
      "terra1lxx40s29qvkrcj8fsa3yzyehy7w50umdvvnls2r830rys6lu2zns63eelv";

    // Split the string into parts based on space
    let parts = input.split(" ");

    // Process each part
    let result = parts.map((part) => {
      if (part.startsWith("[") && part.endsWith("]")) {
        // Remove the brackets and split by "/"
        let innerContent = part.slice(1, -1); // Remove the surrounding brackets
        let [firstPart, secondPart] = innerContent.split("/");

        // Capitalize the first part
        firstPart = firstPart.charAt(0).toUpperCase() + firstPart.slice(1);

        return `${firstPart} ${secondPart}`;
      }
      // Check for "uluna" and process
      if (part.includes("uluna")) {
        let number = parseFloat(part.replace("uluna", "")); // Remove "uluna" and get the number
        let formattedNumber = (number / 1e6).toFixed(6); // Divide by 1e6 and format it
        return `${formattedNumber} LUNA`;
      }

      // Check for the long "terra1..." string and process
      if (part.includes(longUnit)) {
        let number = parseFloat(part.replace(longUnit, "")); // Remove the long "terra1..." and get the number
        let formattedNumber = (number / 1e6).toFixed(6); // Divide by 1e6 and format it
        return `${formattedNumber} ROAR`;
      }

      // Check if the part is alphanumeric but does not start with a number
      if (/[a-zA-Z]/.test(part) && /\d/.test(part)) {
        return shortenHash(part); // Shorten if it contains both letters and numbers
      }

      // Return the part as is if it doesn't match any condition
      return part;
    });

    // Join the parts back into a string and return the result
    return result.join(" ");
  }

  function extractMsgWords(input: string) {
    // Extract the part after ".Msg" and remove "Msg" from it
    const msgPart = input.split(".").slice(-1)[0].replace(/^Msg/, "");

    // Split the words based on capital letters following lowercase letters
    const words = msgPart.split(/(?=[A-Z])/);

    // Join the words with a space to form the final string
    return words.join(" ");
  }
  const getTextColor = (text) => {
    // Check if the text contains '...' (shortened word)
    if (text.includes("...")) {
      return "text-blue-500"; // Blue for shortened words
    }

    // Check if the text is a number
    if (!isNaN(text) && text.includes(".")) {
      return "text-white"; // White for floating-point numbers
    }

    // Default text color (could be black or any other color)
    return "text-gray-400";
  };

  return (
    <div
      style={{ backgroundColor: "#1c1c1f" }}
      className="flex font-sans items-center justify-center h-screen bg-gray-900"
    >
      <div
        style={{ backgroundColor: "#2d2e30" }}
        className="text-white rounded-lg bg-gray-800 shadow-lg p-6 w-[78%] h-[600px]"
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
            {/* <div className="h-[15px]"></div> */}
            <tbody>
              {currentRows.map((transaction, index) => (
                <tr
                  key={index}
                  className={`border-t h-[55px] whitespace-nowrap border-gray-600 text-blue-400`}
                >
                  <td className=" p-2 ">{transaction.height}</td>
                  <td className="p-2 ">{shortenHash(transaction.txhash)}</td>
                  <td className=" p-2  text-gray-400">
                    {formatDate(transaction.timestamp)}
                  </td>
                  <td className=" p-2">
                    {transaction.errorMessage === null ? (
                      <img
                        src={`/success.png`}
                        alt=""
                        className={"w-[20px] h-[20px]"}
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="red"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                      </svg>
                    )}
                  </td>
                  <td className=" p-2 ">
                    {shortenHash(
                      transaction?.messages[0]?.events[0].attributes[1].value
                    )}
                  </td>
                  <td className={` p-2 font-semibold `}>
                    {transaction.errorMessage === null ? (
                      <p>
                        {transaction.amounts.in.length > 0 && (
                          <p className="text-green-500 flex gap-1 mr-2">
                            {Number(transaction.amounts.in[0].amount) / 1e6}
                            <span>
                              {tokenMap.get(transaction.amounts.in[0].denom)}
                            </span>
                          </p>
                        )}
                        {transaction.amounts.out.length > 0 && (
                          <p className="text-red-500 flex gap-1">
                            -{Number(transaction.amounts.out[0].amount) / 1e6}
                            <span>
                              {tokenMap.get(transaction.amounts.out[0].denom)}
                            </span>
                          </p>
                        )}
                      </p>
                    ) : (
                      <span></span>
                    )}
                  </td>
                  <td className="whitespace-normal leading-relaxed p-2">
                    {transaction.errorMessage === null ? (
                      <p>
                        <span className="bg-gray-500 px-[8px] pb-[2px] mr-2 text-gray-200 text-xs rounded-sm">
                          {extractMsgWords(transaction.messages[0].msg.type)}
                        </span>
                        {transaction.messages[0].title && (
                          <span className="mr-2">
                            {transaction?.messages[0]?.title
                              ?.split(" ")
                              .map((word, index) => {
                                const isAlphanumericOrSpecial = /\d/.test(word);
                                return (
                                  <span
                                    key={index}
                                    className={
                                      isAlphanumericOrSpecial
                                        ? "text-blue-400"
                                        : "text-gray-400 font-semibold"
                                    }
                                  >
                                    {isAlphanumericOrSpecial
                                      ? shortenHash(word)
                                      : word}
                                  </span>
                                );
                              })
                              .reduce(
                                (acc, elem) =>
                                  acc === null ? [elem] : [...acc, " ", elem],
                                null
                              )}
                          </span>
                        )}
                        <span className="text-gray-400 font-semibold">
                          {transaction.messages[0].actions.map(
                            (action, index) => {
                              return (
                                <span key={index}>
                                  {formatUnits(action.canonicalMsgs[0])
                                    .split(" ")
                                    .map((part, index) => (
                                      <span
                                        key={index}
                                        className={getTextColor(part)}
                                      >
                                        {part}{" "}
                                      </span>
                                    ))}
                                </span>
                              );
                            }
                          )}
                        </span>
                      </p>
                    ) : (
                      <span className="text-red-500">
                        {transaction.errorMessage}
                      </span>
                    )}
                  </td>
                  <td className="p-2 pr-[30px] text-gray-400 font-semibold">
                    <span className="mr-1">
                      {Number(
                        transaction.tx.value.authInfo.fee.amount[0].amount
                      ) / 1e6}
                    </span>
                    <span>
                      {tokenMap.get(
                        transaction.tx.value.authInfo.fee.amount[0].denom
                      )}
                    </span>
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
                <DropdownMenuContent
                  key={1}
                  className="bg-[#343434] text-white border-gray-500"
                >
                  {rowsOptions.map((option) => (
                    <div>
                      <DropdownMenuItem
                        onClick={() => {
                          setRowsPerPage(option);
                          setCurrentPage(1);
                        }}
                        className="bg-[#343434] hover:bg-[#212226] "
                        key={option}
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
