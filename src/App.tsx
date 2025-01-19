import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/Table";
import { Spinner } from "./components/Spinner";
import { PaginationControls } from "./components/PaginationControls";

import { useFetchData, usePagination } from "./hooks";

import styles from "./App.module.css";

type Data = {
  "s.no": number;
  "amt.pledged": number;
  blurb: string;
  by: string;
  country: string;
  currency: string;
  "end.time": string;
  location: string;
  "percentage.funded": number;
  "num.backers": string;
  state: string;
  title: string;
  type: string;
  url: string;
};

export function App() {
  const { data, isLoading, error } = useFetchData<Data[]>(
    "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json"
  );

  return (
    <div className={`${styles.container}`}>
      {isLoading && <Spinner />}
      {error && <div className={styles.error}>Error: {error}</div>}
      {data && <TableWrapper data={data} />}
    </div>
  );
}

const TableWrapper = ({ data }: { data: Data[] }) => {
  const { currentItems, currentPage, totalPages, nextPage, prevPage, goToPage, startIndex, endIndex, totalItems } =
    usePagination({
      items: data,
      itemsPerPage: 5,
    });

  return (
    <>
      <Table
        aria-label="Funding table"
        aria-describedby="Funding recieved"
        data={data}
        caption="Funding table"
      >
        <TableHeader>
          <TableRow>
            <TableHead scope="col">S.No.</TableHead>
            <TableHead scope="col">Percentage funded</TableHead>
            <TableHead scope="col">Amount pledged</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.map((item) => (
            <TableRow key={item["s.no"]}>
              <TableCell aria-label="S.No">{item["s.no"]}</TableCell>
              <TableCell aria-label="Percentage funded">{item["percentage.funded"]}</TableCell>
              <TableCell aria-label="Amount pledged">{item["amt.pledged"]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        nextPage={nextPage}
        prevPage={prevPage}
        goToPage={goToPage}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={totalItems}
      />
    </>
  );
};
