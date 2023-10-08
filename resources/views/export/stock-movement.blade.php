<table border="1">
    <thead>
        <tr>
            <th>No.</th>
            <th>Product Name</th>
            <th>Package</th>
            <th>Brand</th>
            <th>Begin Stock</th>
            <th>In. Purchase Delivered</th>
            <th>In. Product Return</th>
            <th>In. Sales Return</th>
            <th>Out. Stock Order</th>
            <th>Out. Return To Suplier</th>
            <th>Out. Sales</th>
            <th>Out. Transfer Out</th>
            <th>End Stock</th>
            <th>End Forecast</th>
        </tr>
    </thead>
  <tbody>
  @foreach($data as $key => $row)
    <tr>
        <th>{{ $key+1 }}</th>
        <th>{{ $row->product_name }}</th>
        <th>{{ $row->package_name }}</th>
        <th>{{ $row->brand }}</th>
        <th>{{ $row->begin_stock }}</th>
        <th>{{ $row->purchase_delivered }}</th>
        <th>{{ $row->product_return }}</th>
        <th>{{ $row->sales_return }}</th>
        <th>{{ $row->stock }}</th>
        <th>{{ $row->return_suplier }}</th>
        <th>{{ $row->sales }}</th>
        <th>{{ $row->transfer_out }}</th>
        <th>{{ $row->begin_stock + ($row->purchase_delivered + $row->product_return + $row->sales_return) - ($row->stock + $row->return_suplier + $row->sales + $row->transfer_out) }}</th>
        <th>{{ $row->stock + $row->sales }}</th>
    </tr>
@endforeach
</tbody>
</table>