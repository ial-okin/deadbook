import { NavLink } from "react-router";

import { Eye, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Survivor } from "@/models";
import { formatLocation } from "@/lib/utils";
import { SurvivorPageUrl, TradePageUrl } from "@/pages/urls";

export function SurvivorsList({ survivors }: { survivors: Survivor[] }) {
  return (
    <div className="space-y-4">
      <div>
        {/* Desktop view - Table */}
        <div className="rounded-md border hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Last Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {survivors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No survivors found
                  </TableCell>
                </TableRow>
              ) : (
                survivors.map((survivor) => (
                  <TableRow key={survivor.id}>
                    <TableCell className="font-medium">
                      {survivor.name}
                    </TableCell>
                    <TableCell>{survivor.age}</TableCell>
                    <TableCell>{survivor.gender}</TableCell>
                    <TableCell>
                      {formatLocation({
                        latitude: survivor.latitude,
                        longitude: survivor.longitude,
                      })}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <NavLink
                            to={SurvivorPageUrl.replace(":id", survivor.id)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View details</span>
                          </NavLink>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <NavLink
                            to={`${TradePageUrl}?trader1_id=${survivor.id}`}
                          >
                            <Package className="mr-2 h-4 w-4" />
                            <span className="sr-only">Trade</span>
                          </NavLink>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile view - Cards */}
        <div className="space-y-4 md:hidden">
          {survivors.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              No survivors found
            </p>
          ) : (
            survivors.map((survivor) => (
              <div
                key={survivor.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{survivor.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {survivor.age} • {survivor.gender}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Last Location
                  </p>
                  <p className="text-sm">
                    {" "}
                    {formatLocation({
                      latitude: survivor.latitude,
                      longitude: survivor.longitude,
                    })}
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="ghost" size="sm" asChild>
                    <NavLink to={SurvivorPageUrl.replace(":id", survivor.id)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </NavLink>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <NavLink to={`${TradePageUrl}?trader1_id=${survivor.id}`}>
                      <Package className="h-4 w-4 mr-1" />
                      Trade
                    </NavLink>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
