import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export async function GET(request,{params}) {
    const{id} = await params;
    const promisePool = mysqlPool.promise();
    const [rows,fields] = await promisePool.query(
        'SELECT * FROM attractions WHERE id = ?;',
        [id]
    );

    if(rows.length == 0) {
        return NextResponse.json(
            {message: 'Attraction with id ${id} not found.'},
            {status: 404 }
        );
    }

    return NextResponse.json(rows[0]);
}

// PUT /api/attractions/:id  -> Update
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, detail, coverimage, latitude, longitude } = body;

    const promisePool = mysqlPool.promise();
    const [exists] = await promisePool.query(
      `SELECT id FROM attractions WHERE id = ?`,
      [id]
    );
    if (exists.length === 0) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    await promisePool.query(
      `UPDATE attractions
         SET name = ?, detail = ?, coverimage = ?, latitude = ?, longitude = ?
       WHERE id = ?`,
      [name, detail ?? "", coverimage, latitude ?? null, longitude ?? null, id]
    );

    const [rows] = await promisePool.query(
      `SELECT * FROM attractions WHERE id = ?`,
      [id]
    );
    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


// DELETE /api/attractions/:id  -> Delete
export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    const promisePool = mysqlPool.promise();

    const [exists] = await promisePool.query(
      `SELECT id FROM attractions WHERE id = ?`,
      [id]
    );
    if (exists.length === 0) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    await promisePool.query(`DELETE FROM attractions WHERE id = ?`, [id]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
