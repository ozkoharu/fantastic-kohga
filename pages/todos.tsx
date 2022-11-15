import { GetServerSideProps } from "next";

const Todos = () => { }
export default Todos;

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
    res.setHeader('Context-Type', 'image/svg+xml');

    console.log('query', query);
    res.write(`<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 45" width="30" height="45">
<g stroke="none" fill="blue">
    <path d="M 15 45 L 30 15 S 15 -15 0 15 L 15 45" />
</g>
<g fill="white" stroke="white" stroke-width="1">
    <text text-anchor="middle" x="15" y="25">${query.n}</text>
</g>
</svg>`);
    res.end();
    return { props: {} };
}
