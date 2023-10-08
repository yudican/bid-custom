<?php

namespace App\Exports;

use App\Models\LeadMaster;
use App\Models\Brand;
use App\Models\InventoryItem;
use App\Models\LeadActivity;
use App\Models\LeadHistory;
use App\Models\LeadNegotiation;
use App\Models\OrderManual;
use App\Models\ProductNeed;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class OrderManualExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $account_id;
    protected $title;
    public function __construct($account_id, $title = 'ExportConverData')
    {
        $this->account_id = $account_id;
        $this->title = $title;
    }

    public function query()
    {
        return OrderManual::query()->whereCompanyId($this->account_id);
    }

    public function map($row): array
    {
        return [
            $row->title,
            $row->contactUser->name,
            $row->salesUser->name,
            $row->user->name,
            $row->created_at,
            $row->harga_awal,
            $row->payment_term,
            $row->status,
        ];
    }

    public function headings(): array
    {
        return [
            'Title',
            'Contact',
            'Sales',
            'Created By',
            'Created On',
            'Nominal',
            'Payment Term',
            'Status',
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return $this->title;
    }
}
