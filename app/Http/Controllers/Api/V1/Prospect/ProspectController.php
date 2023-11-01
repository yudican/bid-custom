<?php

namespace App\Http\Controllers\Api\V1\Prospect;

use App\Http\Controllers\Controller;
use App\Models\Prospect;
use App\Models\ProspectActivity;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Ramsey\Uuid\Uuid;

class ProspectController extends Controller
{
    public function home($prospect_id = null)
    {
        return view('spa.spa-index');
    }

    // index
    public function index(Request $request)
    {
        $prospect = Prospect::query();
        $user = auth()->user();
        if (in_array($user->role->role_type, ['superadmin', 'admin', 'adminsales'])) {
        } else {
            $user = auth()->user();
            if ($user->role->role_type == 'cs') {
                $prospect->where('async_to', $user->id)->orWhere('created_by', $user->id);
            } else {
                $prospect->where('created_by', $user->id);
            }
        }

        if ($request->query('status')) {
            if ($request->query('status') != 'all') {
                $prospect->where('tag', $request->query('status'));
            }
        }

        // if ($request->query('activity')) {
        //     if ($request->query('activity') != 'all') {
        //         $activity = $request->query('activity');
        //         if ($activity == '0') {
        //             $prospect->where('status', 'new')->where('tag', 'cold');
        //         }

        //         if ($activity == '<5') {
        //             $prospect->where('status', 'onprogress')->where('tag', 'cold');
        //         }

        //         if ($activity == '>5') {
        //             $prospect->whereIn('tag', ['warm', 'hot']);
        //         }
        //     }
        // }

        if ($request->query('date')) {
            if ($request->query('date') != 'all') {
                $desiredDate = Carbon::now();

                $dateType = $request->query('date');
                if ($dateType == 'day') {
                    $prospect->whereDate('created_at', $desiredDate);
                }

                if ($dateType == 'week') {
                    $startDate = Carbon::now()->subDays(7)->startOfDay();
                    $endDate = Carbon::now()->endOfDay();
                    $prospect->whereBetween('created_at', [$startDate, $endDate]);
                }

                if ($dateType == 'month') {
                    $prospect->whereYear('created_at', $desiredDate->year)->whereMonth('created_at', $desiredDate->month);
                }

                if ($dateType == 'year') {
                    $prospect->whereYear('created_at', $desiredDate->year);
                }
            }
        }

        if ($request->query('search')) {
            $search = $request->query('search');
            $prospect->where('prospect_number', 'like', "%$search%");
            $prospect->orWhereHas('createBy', function ($query) use ($search) {
                $query->where('name', 'like', "%$search%");
            });
        }

        if ($request->query('startDate') && $request->query('endDate')) {
            $startDate = $request->query('startDate');
            $endDate = $request->query('endDate');
            $prospect->whereBetween('created_at', [$startDate, $endDate]);
        }


        $prospects = $prospect->orderBy('created_at', $request->query('short') ?? 'DESC')->get();
        $prospectsData = [];

        $activity = $request->query('activity');
        foreach ($prospects as $key => $item) {
            if ($activity) {
                if ($activity == '<1') {
                    if ($item->activity_total == 0) {
                        $prospectsData[] = $item;
                    }
                }
                if ($activity == '<5') {
                    if ($item->activity_total <= 5) {
                        $prospectsData[] = $item;
                    }
                }

                if ($activity == '>5') {
                    if ($item->activity_total > 5) {
                        $prospectsData[] = $item;
                    }
                }
                if ($activity == 'all') {
                    $prospectsData[] = $item;
                }
            } else {
                $prospectsData[] = $item;
            }
        }

        $perPage = 10; // Number of records per page, you can adjust this as needed
        $page = $request->query('page', 1); // Get the current page from the query parameters

        // Calculate the offset to start slicing the array
        $offset = ($page - 1) * $perPage;

        // Slice the array to get the current page's data
        $currentPageResults = array_slice($prospectsData, $offset, $perPage);

        // Create a LengthAwarePaginator instance
        $paginator = new LengthAwarePaginator(
            $currentPageResults,
            count($prospectsData),
            $perPage,
            $page,
            [
                'path' => $request->url(), // Current URL
                'query' => $request->query(), // Query parameters
            ]
        );

        return response()->json([
            'message' => 'List Prospect',
            'data' => $paginator,
            'params' => [
                'status' => $request->query('status'),
                'date' => $request->query('date'),
                'activity' => $request->query('activity'),
            ]
        ]);
    }

    public function show($id)
    {
        $prospect = Prospect::with(['activities'])->where('uuid', $id)->first();

        if (!$prospect) {
            $latestProspect = Prospect::latest()->first();

            $sequenceNumber = 'SA001';
            $currentYear = now()->format('Y');
            if ($latestProspect) {
                $number = explode('/', $latestProspect->prospect_number);
                $sequenceNumber = (int)substr($number[1], -3) + 1;
            }

            $prospect_number = 'PROSPECT/SA' . str_pad($sequenceNumber, 3, '0', STR_PAD_LEFT) . '/' . $currentYear;
            return response()->json([
                'message' => 'Not Found',
                'data' => [
                    'prospect_number' => $prospect_number,
                    'created_by_name' => auth()->user()->name
                ]
            ], 404);
        }

        return response()->json([
            'message' => 'List Prospect',
            'data' => $prospect
        ]);
    }

    public function createProspect(Request $request)
    {
        $validate = [
            'contact' => 'required',
            'status' => 'required',
            'tag' => 'required',
        ];

        $validator = Validator::make($request->all(), $validate);

        // response validation error
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Form Tidak Lengkap'
            ], 400);
        }

        try {
            DB::beginTransaction();

            $data = [
                'uuid' => Uuid::uuid4(),
                'contact' => $request->contact,
                'created_by' => auth()->user()->id,
                'status' => 'new',
                'tag' => $request->tag,
                'async_to' => $request->async_to,
            ];


            $prospect = Prospect::updateOrCreate(['uuid' => $request->prospect_id], $data);

            if (!$request->prospect_id) {
                if ($request->items) {
                    $items = $request->items;
                    if (is_array($items) && count($items) > 0) {
                        foreach ($items as $key => $item) {
                            $dataProspect = [
                                'uuid' => Uuid::uuid4(),
                                'prospect_id' => $prospect->id,
                                'notes' => isset($item['notes']) ? $item['notes'] : null,
                                'status' => isset($item['status']) ? $item['status'] : 'new',
                                'submit_date' => $item['submit_date'] ?? Carbon::now(),
                            ];

                            if (count($items) <= 4) {
                                $prospect->update([
                                    'tag' => 'cold',
                                    'status' => 'new'
                                ]);
                            } else if (count($items) > 6) {
                                $prospect->update([
                                    'tag' => 'hot',
                                    'status' => 'closed'
                                ]);
                            } else if (count($items) > 4 && count($items) < 7) {
                                $prospect->update([
                                    'tag' => 'warm',
                                    'status' => 'onprogress'
                                ]);
                            }
                            // $attachment = null;
                            // if ($item['attachment']) {
                            //     $attachment = $this->uploadImage($item, 'attachment');
                            // }

                            // if ($attachment) {
                            //     $data['attachment'] = getImage($attachment);
                            // }

                            ProspectActivity::create($dataProspect);
                        }
                    }
                }
            }

            DB::commit();
            return response()->json([
                'message' => 'Successfully add prospect',
                'data' => $prospect
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error add prospect',
                'data' => [],
                'error' => $th->getMessage()
            ], 400);
        }
    }

    function getProspectActivity($id)
    {
        $prospect = Prospect::with(['activities'])->where('uuid', $id)->first();

        if (!$prospect) {
            return response()->json([
                'message' => 'Not Found',
                'data' => []
            ], 404);
        }

        return response()->json([
            'message' => 'List Prospect',
            'data' => $prospect->activities
        ]);
    }

    function getAllActivityProspect(Request $request)
    {
        $prospect = ProspectActivity::query();
        if ($request->query('date')) {
            $prospect->whereDate('created_at', $request->query('date'));
        }

        return response()->json([
            'message' => 'List Prospect',
            'data' => $prospect->orderBy('created_at', 'DESC')->get()
        ]);
    }

    function createProspectActivity(Request $request)
    {
        $validate = [
            'prospect_id' => 'required',
            'notes' => 'required',
            'status' => 'required',
        ];

        $validator = Validator::make($request->all(), $validate);

        // response validation error
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Form Tidak Lengkap',
                'error' => $validator->errors()
            ], 400);
        }
        $attachment = null;
        if ($request->attachment) {
            $attachment = $this->uploadImage($request, 'attachment');
        }

        try {
            DB::beginTransaction();
            $prospect = Prospect::find($request->prospect_id);
            $count = $prospect->activities()->count();
            if ($count < 4) {
                $prospect->update([
                    'tag' => 'cold',
                    'status' => 'onprogress'
                ]);
            } else if ($count > 5) {
                $prospect->update([
                    'tag' => 'hot',
                    'status' => 'closed'
                ]);
            } else if ($count > 3 && $count < 6) {
                $prospect->update([
                    'tag' => 'warm',
                    'status' => 'onprogress'
                ]);
            } else if ($count == 0) {
                $prospect->update([
                    'tag' => 'cold',
                    'status' => 'onprogress'
                ]);
            }

            $data = [
                'uuid' => Uuid::uuid4(),
                'prospect_id' => $request->prospect_id,
                'notes' => $request->notes,
                'status' => $request->status,
                'submit_date' => Carbon::now(),
            ];

            if ($attachment) {
                $data['attachment'] = getImage($attachment);
            }

            ProspectActivity::create($data);


            DB::commit();
            return response()->json([
                'message' => 'Successfully add prospect Activity',
                'data' => $prospect,
                'count' => $count
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error add prospect Activity',
                'data' => []
            ], 400);
        }
    }

    function updateProspectActivity(Request $request, $id)
    {
        $validate = [
            'notes' => 'required',
            'status' => 'required',
        ];

        $validator = Validator::make($request->all(), $validate);

        // response validation error
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Form Tidak Lengkap'
            ], 400);
        }
        $prospect = ProspectActivity::where('uuid', $id)->first();

        if (!$prospect) {
            return response()->json([
                'message' => 'Not Found',
                'data' => []
            ], 404);
        }

        $attachment = null;
        if ($request->attachment) {
            $attachment = $this->uploadImage($request, 'attachment');
        }

        try {
            DB::beginTransaction();

            $data = [
                'notes' => $request->notes,
                'status' => $request->status,
            ];

            if ($attachment) {
                $data['attachment'] = getImage($attachment);
            }

            $prospect->update($data);


            DB::commit();
            return response()->json([
                'message' => 'Successfully update prospect Activity',
                'data' => $prospect
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error update prospect Activity',
                'data' => []
            ], 400);
        }
    }

    public function updatedProspect(Request $request, $id)
    {
        $validate = [
            // 'contact' => 'required',
            'status' => 'required',
            'tag' => 'required',
        ];

        $validator = Validator::make($request->all(), $validate);

        // response validation error
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Form Tidak Lengkap'
            ], 400);
        }

        $prospect = Prospect::where('uuid', $id)->first();

        if (!$prospect) {
            return response()->json([
                'message' => 'Not Found',
                'data' => []
            ], 404);
        }

        try {
            DB::beginTransaction();

            $status = $request->status;

            $data = [
                // 'contact' => $request->contact,
                'tag' => $request->tag,
            ];

            if ($status == 'hot') {
                $data['status'] = 'closed';
            }

            $prospect->update($data);

            DB::commit();
            return response()->json([
                'message' => 'Successfully add prospect',
                'data' => $prospect
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error add prospect',
                'data' => []
            ], 400);
        }
    }

    public function deleteProspect($id)
    {

        $prospect = Prospect::where('uuid', $id)->first();

        if (!$prospect) {
            return response()->json([
                'message' => 'Not Found',
                'data' => []
            ], 404);
        }

        try {
            DB::beginTransaction();

            $prospect->delete();

            DB::commit();
            return response()->json([
                'message' => 'Successfully Deleted prospect',
                'data' => $prospect
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error Deleted prospect',
                'data' => []
            ], 400);
        }
    }

    public function uploadImage($request, $path)
    {
        if (!$request->hasFile($path)) {
            return response()->json([
                'error' => true,
                'message' => 'File not found',
                'status_code' => 400,
            ], 400);
        }
        $file = $request->file($path);
        if (!$file->isValid()) {
            return response()->json([
                'error' => true,
                'message' => 'Image file not valid',
                'status_code' => 400,
            ], 400);
        }
        $file = Storage::disk('s3')->put('upload/prospect/activity', $request[$path], 'public');
        return $file;
    }

    public function prospectTags()
    {
        $user = auth()->user();
        if (in_array($user->role->role_type, ['superadmin', 'admin', 'adminsales'])) {
            $data = [
                ['name' => 'All', 'tag' => 'all', 'count' => Prospect::count()],
                ['name' => '🔥 Hot', 'tag' => 'hot', 'count' => Prospect::where('tag', 'hot')->count()],
                ['name' => '❄️ Cold', 'tag' => 'cold', 'count' => Prospect::where('tag', 'cold')->count()],
                ['name' => '🌤 Warm', 'tag' => 'warm', 'count' => Prospect::where('tag', 'warm')->count()],
            ];

            return response()->json([
                'error' => false,
                'message' => 'List Tag',
                'data' => $data,
            ]);
        } else {
            $data = [
                ['name' => 'All', 'tag' => 'all', 'count' => Prospect::where('created_by', auth()->user()->id)->orWhere('async_to', auth()->user()->id)->count()],
                ['name' => '🔥 Hot', 'tag' => 'hot', 'count' => Prospect::where('created_by', auth()->user()->id)->orWhere('async_to', auth()->user()->id)->where('tag', 'hot')->count()],
                ['name' => '❄️ Cold', 'tag' => 'cold', 'count' => Prospect::where('created_by', auth()->user()->id)->orWhere('async_to', auth()->user()->id)->where('tag', 'cold')->count()],
                ['name' => '🌤 Warm', 'tag' => 'warm', 'count' => Prospect::where('created_by', auth()->user()->id)->orWhere('async_to', auth()->user()->id)->where('tag', 'warm')->count()],
            ];

            return response()->json([
                'error' => false,
                'message' => 'List Tag',
                'data' => $data,
            ]);
        }
    }


    public function prospectStatus()
    {
        $data = [
            ['name' => 'All', 'status' => 'all', 'count' => Prospect::where('created_by', auth()->user()->id)->count()],
            ['name' => 'New', 'status' => 'new', 'count' => Prospect::where('created_by', auth()->user()->id)->where('status', 'new')->count()],
            ['name' => 'On Progress', 'status' => 'onprogress', 'count' => Prospect::where('created_by', auth()->user()->id)->where('status', 'onprogress')->count()],
            ['name' => 'Closed', 'status' => 'closed', 'count' => Prospect::where('created_by', auth()->user()->id)->where('status', 'closed')->count()],
        ];

        return response()->json([
            'error' => false,
            'message' => 'List Status',
            'data' => $data,
        ]);
    }


    public function prospectByContact($user_id)
    {
        $prospects = Prospect::where('contact', $user_id)->get();

        return response()->json([
            'message' => 'success',
            'data' => $prospects
        ]);
    }
}
