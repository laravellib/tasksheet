<?php

use Illuminate\Database\Seeder;

use App\Utils\Csv;

class OrganizationTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      // User
      $userFolder = factory(App\Models\Folder::class)->create([ 'name' => 'Demos' ]);
      $users = factory(App\Models\User::class)->create([ 
        'id' => '75e3c4f9-b261-3343-a320-8ee9fb0c931e', 
        'folderId' => $userFolder->id
      ])->each(function($user) {

        // User Active + Color
        $user->active()->save(factory(App\Models\UserActive::class)->make());
        $user->color()->save(factory(App\Models\UserColor::class)->make());
        $user->save();

        // Organization
        $organizationFolder = factory(App\Models\Folder::class)->create([ 'name' => 'Company' ]);
        $organization = factory(App\Models\Organization::class)->create([
          'folderId' => $organizationFolder->id
        ])->each(function($organization) use($organizationFolder, $user) {

          // Departments Dropdown
          $departmentsOptions = [
            'Sales',
            'Estimating',
            'Purchasing',
            'PM',
            'CNC',
            'Fab',
            'Metal',
            'Paint',
            'Shipping'
          ];
          $departmentsDropdown = factory(App\Models\SheetDropdown::class)->create([ 
            'name' => 'Departments',
            'userId' => $user->id // For now, have it belong to the user
          ]);
          $departmentsDropdownOptions = factory(App\Models\SheetDropdownOption::class, count($departmentsOptions))->create([
            'sheetDropdownId' => $departmentsDropdown->id
          ]);
          $departmentsDropdownOptions->each(function($deparmentsDropdownOption, $index) use($departmentsOptions) {
            $deparmentsDropdownOption->value = $departmentsOptions[$index];
            $deparmentsDropdownOption->save();
          });


          // Organization Folders
          factory(App\Models\Folder::class, 1)->create()->each(function ($folder, $folderKey) use($organizationFolder) {
            $folder->folderId = $organizationFolder->id;
            $folder->name = 'Purchasing';
            $folder->save();
     
            $sheets = [
              //'Purchasing_15',
              //'Purchasing_250',
              //'2019_Pitching_Advanced',
              //'2019-08-15 - Pitching - Advanced',
              //'2019_Pitching_Standard'
            ];

            // Files
            factory(App\Models\File::class, count($sheets))->create()->each(function ($file, $fileKey) use($folder, $folderKey, $sheets) {
              echo($sheets[$fileKey]);
              $file->folderId = $folder->id;
              $file->name = $sheets[$fileKey];
              $file->save();

              // File types
              $fileTypes = ['SHEET'];
              $fileType = $fileTypes[array_rand($fileTypes, 1)];
              switch($fileType) {

                // Sheets
                case 'SHEET': 

                  $source  = Csv::toArray('database/sources/'.$sheets[$fileKey].'.csv');
                  $sourceCount = count($source);
                  $sourceColumnNames = [];
                  foreach($source[0] as $columnName => $value) {
                    array_push($sourceColumnNames, $columnName);
                  }

                  $sheets = factory(App\Models\Sheet::class, 1)->create();
                  $sheets->each(function($sheet) use ($file, $source, $sourceColumnNames, $sourceCount) {

                    $file->type = 'SHEET';
                    $file->typeId = $sheet->id;
                    $file->save();

                    // Columns
                    $columnCount = count($source[0]);
                    $visibleColumns = [];
                    $columns = factory(App\Models\SheetColumn::class, $columnCount)->create();
                    $columns->each(function($column, $key) use ($sheet, $source, $sourceColumnNames, $visibleColumns) {
                      $column->sheetId = $sheet->id;
                      $column->name = $sourceColumnNames[$key];
                      $column->type = 'STRING';
                      $column->save();
                      array_push($visibleColumns, $column->id);
                    });
                    $sheet->visibleColumns = $visibleColumns;
                    $sheet->save();

                    // Rows
                    $rows = factory(App\Models\SheetRow::class, $sourceCount)->create();
                    $rows->each(function($row, $rowKey) use($columns, $sheet, $source) {
                      $row->sheetId = $sheet->id;
                      $row->save();

                      // Cells
                      $columns->each(function($column, $columnKey) use($row, $rowKey, $sheet, $source) {
                        /*
                        $cellValues = [
                          'NUMBER' => strval(rand(0, 100)),
                          'BOOLEAN' => strval(rand(0, 1)),
                          'DATETIME' => null,
                        ];
                        */
                        $cell = factory(App\Models\SheetCell::class)->create();
                        $cell->sheetId = $sheet->id;
                        $cell->rowId = $row->id;
                        $cell->columnId = $column->id;
                        //$cell->value = $column->type === 'STRING' ? $cell->value : $cellValues[$column->type];
                        $cell->value = $source[$rowKey][$column->name];
                        $cell->save();
                      });
                    });
                  });
                break;
              }
            });
          });
        });
      });
    }
}
