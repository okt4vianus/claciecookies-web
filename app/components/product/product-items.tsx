import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import type { paths } from "~/schema";

type Products =
  paths["/products"]["get"]["responses"][200]["content"]["application/json"];

export function ProductItems({ products }: { products: Products }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
      {products.map((product) => {
        const image = product.images?.[0];
        if (!image) return null;

        return (
          <li key={product.id}>
            <Card>
              <CardHeader>
                <picture className="rounded-lg block overflow-hidden">
                  <img
                    className="hover:scale-110 transition duration-500 ease-in-out h-70 w-full object-cover"
                    src={image.url}
                    alt={image.name || "Product image"}
                  />
                </picture>
              </CardHeader>

              <CardContent>
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="font-medium mb-3">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>
              </CardContent>
              <CardFooter className="mt-auto justify-center">
                <div>
                  <Button variant={"destructive"} asChild>
                    <Link to={`/products/${product.slug}`}>View Product</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
